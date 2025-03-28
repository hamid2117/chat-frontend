import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import httpClient from '../api/httpClient'
import { useAuthStatus } from './useAuth'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import conversationApi from '../services/conversation'

export interface User {
  id: string
  displayName: string
  profilePicture: string
  profilePictureUrl: string
  email: string
}

export interface Participant {
  userId: string
  user: User
}

export interface Conversation {
  id: string
  type: 'DIRECT' | 'GROUP'
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    displayName: string
  }
  name: string
  picture: string
  description?: string
  participants: Participant[]
  unreadCount: number
}

interface ConversationsResponse {
  success: boolean
  message: string
  data: {
    rows: Conversation[]
    count: number
  }
}
export interface CreateDirectConversationInput {
  userId: string
}

export interface CreateGroupConversationInput {
  name: string
  participants: string[]
}

export const CONVERSATIONS_QUERY_KEY = ['conversations']

const fetchConversations = async (): Promise<ConversationsResponse> => {
  const response = await httpClient.get('/conversation')
  return response.data
}

export function useConversations() {
  const { user } = useAuthStatus()
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const socket = io('http://localhost:3000')
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_user', { userId: user.id })
    })

    socket.on('unread_count_update', ({ conversationId, unreadCount }) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData

        const updatedRows = oldData.data.rows.map((conv: Conversation) => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount }
          }
          return conv
        })

        return {
          ...oldData,
          data: {
            ...oldData.data,
            rows: updatedRows,
          },
        }
      })
    })

    socket.on('new_conversation', ({ conversation, initiatedBy }) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData

        const conversationExists = oldData.data.rows.some(
          (conv: Conversation) => conv.id === conversation.id
        )

        if (conversationExists) {
          return oldData
        }

        let formattedConversation = { ...conversation, unreadCount: 1 }

        if (conversation.type === 'DIRECT' && user) {
          const otherParticipant = conversation.participants[0].user

          if (otherParticipant) {
            formattedConversation = {
              ...formattedConversation,
              name: otherParticipant.displayName,
              picture: otherParticipant.profilePicture,
              userId: otherParticipant.id,
            }
          }
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            rows: [formattedConversation, ...oldData.data.rows],
            count: oldData.data.count + 1,
          },
        }
      })

      if (initiatedBy !== user.id) {
        const initiatorName =
          conversation.participants.find((p: any) => p.userId === initiatedBy)
            ?.user?.displayName || 'Someone'

        const message =
          conversation.type === 'DIRECT'
            ? `New message from ${initiatorName}`
            : `You were added to group: ${conversation.name}`

        toast.info(message)
      }
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [user, queryClient])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: fetchConversations,
    enabled: !!user,
    staleTime: 1000 * 60,
  })
  const markConversationAsRead = useCallback(
    (conversationId: string) => {
      const socket = socketRef.current
      if (!socket) return

      httpClient
        .post(`/conversation/${conversationId}/seen`)
        .catch((err) =>
          console.error('Failed to mark conversation as seen', err)
        )

      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData

        const updatedRows = oldData.data.rows.map((conv: Conversation) => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount: 0 }
          }
          return conv
        })

        return {
          ...oldData,
          data: {
            ...oldData.data,
            rows: updatedRows,
          },
        }
      })
    },
    [socketRef, queryClient]
  )

  const processedConversations =
    data?.data?.rows?.map((conversation) => {
      if (conversation.type === 'DIRECT' && user) {
        const otherParticipant = conversation.participants.find(
          (p) => p.userId !== user.id
        )?.user

        if (otherParticipant) {
          return {
            ...conversation,
            name: otherParticipant.displayName,
            picture: otherParticipant.profilePicture,
          }
        }
      }
      return conversation
    }) || []
  const groupChats = processedConversations
    .filter((conv) => conv.type === 'GROUP')
    .map((conv) => ({
      id: conv.id,
      name: conv.name,
      picture: conv.picture,
      type: conv.type,
      participants: conv.participants,
      description: conv.description,
      updatedAt: conv.updatedAt,
      createdBy: conv.createdBy,
      unreadCount: conv.unreadCount || 0,
    }))

  const directMessages = processedConversations
    .filter((conv) => conv.type === 'DIRECT')
    .map((conv) => {
      const participant = conv.participants.find((p) => p.userId !== user.id)
      if (!participant || !participant.user) {
        return null
      }
      const otherParticipant = participant.user

      return {
        id: conv.id,
        name: otherParticipant.displayName,
        picture: otherParticipant.profilePicture,
        type: conv.type,
        userId: participant.userId,
        updatedAt: conv.updatedAt,
        unreadCount: conv.unreadCount || 0,
      }
    })
    .filter(Boolean)
  return {
    conversations: processedConversations,
    groupChats,
    directMessages,
    isLoading,
    error,
    refetch,
    markConversationAsRead,
  }
}

export function useCreateDirectConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: conversationApi.createDirect,
    onSuccess: () => {
      // Invalidate conversations query to refetch the list
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
      toast.success('Direct conversation created')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create direct conversation'
      )
    },
  })
}

export function useCreateGroupConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: conversationApi.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
      toast.success('Group conversation created')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create group conversation'
      )
    },
  })
}

export function useUpdateGroupConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<
        CreateGroupConversationInput & {
          description?: string
          picture?: string
        }
      >
    }) => {
      return conversationApi.updateGroup(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
      toast.success('Group updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update group')
    },
  })
}
