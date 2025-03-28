import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  CONVERSATIONS_QUERY_KEY,
  CreateGroupConversationInput,
} from './useConversations'
import conversationApi from './api'

export function useCreateDirectConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: conversationApi.createDirect,
    onSuccess: () => {
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
