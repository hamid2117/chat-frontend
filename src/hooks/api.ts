import { LoginFormInputs } from '../types/auth.type'
import {
  CreateDirectConversationInput,
  CreateGroupConversationInput,
} from '../hooks/useConversations'
import httpClient from '../api/httpClient'

const authApi = {
  login: async (credentials: LoginFormInputs) => {
    const response = await httpClient.post('/auth/login', credentials, {
      withCredentials: true,
    })
    return response.data
  },
  logout: async () => {
    const response = await httpClient.post(
      '/auth/logout',
      {},
      { withCredentials: true }
    )
    return response.data
  },
  getMe: async () => {
    try {
      const response = await httpClient.get('/user/me', {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      return null
    }
  },
}

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

export default { ...conversationApi, ...authApi }
