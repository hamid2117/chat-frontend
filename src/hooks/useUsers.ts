import { useQuery } from '@tanstack/react-query'
import httpClient from '../api/httpClient'

export interface User {
  id: string
  displayName: string
  profilePicture: string
  email: string
}

interface UsersResponse {
  success: boolean
  message: string
  data: User[]
}

export type ConversationType = 'direct' | 'group'

export const USERS_QUERY_KEY = 'users'

const fetchUsers = async (type: ConversationType): Promise<UsersResponse> => {
  const response = await httpClient.get(`/user/conversation?type=${type}`)
  return response.data
}

export function useUsers(type: ConversationType) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, type],
    queryFn: () => fetchUsers(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
