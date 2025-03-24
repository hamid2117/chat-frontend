export interface SignupFormInputs {
  email: string
  name: string
  username: string
  password: string
}

export interface LoginFormInputs {
  email: string
  password: string
}

export interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSignupSuccess?: (data: SignupFormInputs) => void
  onLoginRedirect: () => void
  title?: string
  submitButtonText?: string
  showLoginOption?: boolean
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (data: LoginFormInputs) => void
  isLoggingIn?: boolean
  onSignupRedirect: () => void
  title?: string
  submitButtonText?: string
  showSignupOption?: boolean
}
