import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LoginFormInputs } from '../types/auth.type'

const authApi = {
  login: async (credentials: LoginFormInputs) => {
    const response = await axios.post('/api/auth/login', credentials, {
      withCredentials: true,
    })
    return response.data
  },
  logout: async () => {
    const response = await axios.post(
      '/api/auth/logout',
      {},
      { withCredentials: true }
    )
    return response.data
  },
  getMe: async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      // If unauthorized or any other error, return null
      return null
    }
  },
}

// Auth query key
export const AUTH_QUERY_KEY = ['auth-user']

// Hook for checking auth status
export function useAuthStatus() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  }
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (userData) => {
      // Update auth cache
      queryClient.setQueryData(AUTH_QUERY_KEY, userData)
      navigate('/home')
    },
  })
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth cache
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      // Invalidate queries that might contain user-specific data
      queryClient.invalidateQueries()
      navigate('/')
    },
  })
}
