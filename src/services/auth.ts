import { LoginFormInputs } from '../types/auth.type'
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
export default { ...authApi }
