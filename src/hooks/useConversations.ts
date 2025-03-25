import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import httpClient from '../api/httpClient'
import { useAuthStatus } from './useAuth'
import { toast } from 'react-toastify'

export interface User {
  id: string
  displayName: string
  profilePicture: string
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

const conversationApi = {
  createDirect: async (data: CreateDirectConversationInput) => {
    const response = await httpClient.post('/conversation/direct', data)
    return response.data
  },

  createGroup: async (data: CreateGroupConversationInput) => {
    const response = await httpClient.post('/conversation/group', data)
    return response.data
  },

  updateGroup: async (
    id: string,
    data: Partial<
      CreateGroupConversationInput & { description?: string; picture?: string }
    >
  ) => {
    const response = await httpClient.put(`/conversation/group/${id}`, data)
    return response.data
  },
}

const fetchConversations = async (): Promise<ConversationsResponse> => {
  const response = await httpClient.get('/conversation')
  return response.data
}

export function useConversations() {
  const { user } = useAuthStatus()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: fetchConversations,
    enabled: !!user,
    staleTime: 1000 * 60, // 1 min
  })

  const processedConversations =
    data?.data?.rows?.map((conversation) => {
      // If it's a direct message, find the other participant
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

  // Separate group chats and direct messages
  const groupChats = processedConversations
    .filter((conv) => conv.type === 'GROUP')
    .map((conv) => ({
      id: conv.id,
      name: conv.name,
      picture: conv.picture,
      participants: conv.participants,
      description: conv.description,
      updatedAt: conv.updatedAt,
    }))

  const directMessages = processedConversations
    .filter((conv) => conv.type === 'DIRECT')
    .map((conv) => ({
      id: conv.id,
      name: conv.name,
      picture: conv.picture,
      userId: conv.participants.find((p) => p.userId !== user?.id)?.userId,
      updatedAt: conv.updatedAt,
    }))

  return {
    conversations: processedConversations,
    groupChats,
    directMessages,
    isLoading,
    error,
    refetch,
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
