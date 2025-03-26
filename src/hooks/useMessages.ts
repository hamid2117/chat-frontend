import { useState, useEffect, useCallback, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import httpClient from '../api/httpClient'
import { toast } from 'react-toastify'

interface Message {
  id: number
  sender: string
  content: string
  timestamp?: string
  conversationId: string
  isDeleted?: boolean
}

interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

interface PaginatedMessages {
  data: {
    messages: Message[]
    totalCount: number
    hasMore: boolean
    nextCursor?: string
  }
}

interface UseMessagesReturn {
  messages: Message[]
  loading: boolean
  error: string | null
  hasMore: boolean
  getMessages: (conversationId: string) => Promise<void>
  loadMoreMessages: () => Promise<void>
  createMessage: (
    conversationId: string,
    content: string,
    attachments?: File[]
  ) => Promise<Message | null>
  updateMessage: (messageId: number, content: string) => Promise<Message | null>
  deleteMessage: (messageId: number) => Promise<boolean>
  setTypingStatus: (conversationId: string, isTyping: boolean) => void
  typingUsers: string[]
}

export function useMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [pageSize] = useState<number>(50)
  const socketRef = useRef<Socket | null>(null)
  const userId = 'current-user-id'

  useEffect(() => {
    const socket = io('http://localhost:3000', { withCredentials: true })
    socketRef.current = socket

    socket.on('connect_error', (err) => {
      setError(`Socket connection error: ${err.message}`)
      toast.error(`Socket connection error: ${err.message}`)
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !currentConversationId) return

    socket.emit('join_conversation', currentConversationId)

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.conversationId === currentConversationId) {
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const handleMessageUpdate = (updatedMessage: Message) => {
      if (updatedMessage.conversationId === currentConversationId) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message
          )
        )
      }
    }

    const handleMessageDelete = (deletedMessage: Message) => {
      if (deletedMessage.conversationId === currentConversationId) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === deletedMessage.id
              ? {
                  ...message,
                  isDeleted: true,
                  content: 'This message has been deleted',
                }
              : message
          )
        )
      }
    }

    const handleTypingStatus = (status: TypingStatus) => {
      if (
        status.conversationId === currentConversationId &&
        status.userId !== userId
      ) {
        if (status.isTyping) {
          setTypingUsers((prev) =>
            prev.includes(status.userId) ? prev : [...prev, status.userId]
          )
        } else {
          setTypingUsers((prev) => prev.filter((id) => id !== status.userId))
        }
      }
    }

    socket.on('new_message', handleNewMessage)
    socket.on('message_updated', handleMessageUpdate)
    socket.on('message_deleted', handleMessageDelete)
    socket.on('typing_status', handleTypingStatus)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('message_updated', handleMessageUpdate)
      socket.off('message_deleted', handleMessageDelete)
      socket.off('typing_status', handleTypingStatus)

      socket.emit('leave_conversation', currentConversationId)
    }
  }, [currentConversationId, userId])

  const getMessages = useCallback(
    async (conversationId: string) => {
      try {
        setLoading(true)
        setError(null)
        setCurrentConversationId(conversationId)

        const { data } = await httpClient.get<PaginatedMessages>(
          `/message/conversation/${conversationId}`,
          {
            params: {
              limit: pageSize,
            },
          }
        )

        setMessages(data?.data?.messages)
        setHasMore(data?.data?.hasMore)
        setNextCursor(data?.data?.nextCursor || null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch messages'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [pageSize]
  )

  const loadMoreMessages = useCallback(async () => {
    if (!currentConversationId || !hasMore || !nextCursor || loading) return

    try {
      setLoading(true)
      setError(null)

      const { data } = await httpClient.get<PaginatedMessages>(
        `/message/conversation/${currentConversationId}`,
        {
          params: {
            limit: pageSize,
            cursor: nextCursor,
          },
        }
      )
      const messages = data?.data?.messages || []
      // Prepend older messages to the beginning of the array
      setMessages((prevMessages) => [...messages, ...prevMessages])
      setHasMore(data?.data?.hasMore)
      setNextCursor(data?.data?.nextCursor || null)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load more messages'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [currentConversationId, hasMore, nextCursor, loading, pageSize])

  const createMessage = async (
    conversationId: string,
    content: string,
    attachments?: File[]
  ): Promise<Message | null> => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      const errorMessage = 'Message content cannot be empty'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }

    try {
      setError(null)
      let response

      if (!attachments || attachments.length === 0) {
        response = await httpClient.post('/message', {
          conversationId,
          contentType: 'TEXT',
          textContent: content,
        })
      } else if (attachments[0].type.startsWith('image/')) {
        const formData = new FormData()
        formData.append('conversationId', conversationId)
        formData.append('contentType', 'IMAGE')
        formData.append('textContent', content)
        formData.append('image', attachments[0])

        response = await httpClient.post('/message/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        const formData = new FormData()
        formData.append('conversationId', conversationId)
        formData.append('contentType', 'FILE')
        formData.append('textContent', content)
        formData.append('file', attachments[0])

        response = await httpClient.post('/message/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      const newMessage = response.data?.data || null
      return newMessage
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create message'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }

  const updateMessage = useCallback(
    async (messageId: number, content: string): Promise<Message | null> => {
      if (!content.trim()) {
        const errorMessage = 'Message content cannot be empty'
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      }

      try {
        setLoading(true)
        setError(null)

        const { data: updatedMessage } = await httpClient.put(
          `/message/${messageId}`,
          {
            content,
          }
        )

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId ? updatedMessage : message
          )
        )

        toast.success('Message updated')

        return updatedMessage
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update message'
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteMessage = useCallback(
    async (messageId: number): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        await httpClient.delete(`/message/${messageId}`)

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  isDeleted: true,
                  content: 'This message has been deleted',
                }
              : message
          )
        )

        toast.success('Message deleted')

        return true
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete message'
        setError(errorMessage)
        toast.error(errorMessage)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const setTypingStatus = useCallback(
    (conversationId: string, isTyping: boolean) => {
      const socket = socketRef.current
      if (!socket) return

      socket.emit('typing_status', {
        userId,
        conversationId,
        isTyping,
      })
    },
    [userId]
  )

  return {
    messages,
    loading,
    error,
    hasMore,
    getMessages,
    loadMoreMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    setTypingStatus,
    typingUsers,
  }
}
