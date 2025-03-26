import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import httpClient from '../api/httpClient'
import { useNavigate } from 'react-router-dom'
import { LoginFormInputs } from '../types/auth.type'
import { toast } from 'react-toastify'

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

export const AUTH_QUERY_KEY = ['auth-user']

export function useAuthStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (error) {
    console.error('Auth status error:', error)
  }
  const user = data?.data || null

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
      toast.success('Login successful! Welcome back.', {
        position: 'top-right',
        autoClose: 3000,
      })

      queryClient.setQueryData(AUTH_QUERY_KEY, userData)
      navigate('/home')
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials and try again.'

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      })

      console.error('Login error:', error)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.success('You have been logged out successfully.', {
        position: 'top-right',
        autoClose: 3000,
      })

      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.invalidateQueries()
      navigate('/')
    },
    onError: (error: any) => {
      toast.error('Logout failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      })

      console.error('Logout error:', error)
    },
  })
}
export function useSignup() {
  return useMutation({
    mutationFn: async (signupData: any) => {
      const response = await httpClient.post('/auth/register', signupData)
      return response.data
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.', {
        position: 'top-right',
        autoClose: 3000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Signup failed. Please try again.'

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      })

      console.error('Signup error:', error)
    },
  })
}
