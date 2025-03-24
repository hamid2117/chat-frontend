export interface SignupFormInputs {
  email: string
  displayName: string
  userName: string
  password: string
}

export interface LoginFormInputs {
  email: string
  password: string
}

export interface SignupModalProps {
  isOpen: boolean
  isSigningUp: boolean
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

export interface UserData {
  displayName: string
  userName: string
  email: string
  profilePicture: string
  isVerified: boolean
}
