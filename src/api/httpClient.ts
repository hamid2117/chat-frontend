import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030',
  withCredentials: true,
})

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default httpClient
