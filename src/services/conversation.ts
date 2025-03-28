import httpClient from '../api/httpClient'
import {
  CreateDirectConversationInput,
  CreateGroupConversationInput,
} from '../hooks/useConversations'

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

export default { ...conversationApi }
