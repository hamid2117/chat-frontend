import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './style.module.scss'
import { LoginModalProps, LoginFormInputs } from '../../../../types/auth.type'

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isLoggingIn,
  onSignupRedirect,
  title = 'Login',
  submitButtonText = 'Login',
  showSignupOption = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      if (onLoginSuccess) {
        onLoginSuccess(data)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close modal'
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.inputGroup}>
              <input
                type='text'
                placeholder='Email Address '
                className={`${styles.inputField} ${
                  errors.email ? styles.inputError : ''
                }`}
                {...register('email', {
                  required: 'Email or phone number is required',
                  pattern: {
                    value:
                      /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{10,})$/,
                    message: 'Please enter a valid email or phone number',
                  },
                })}
              />
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder='Password'
                className={`${styles.inputField} ${
                  errors.password ? styles.inputError : ''
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}

              <div className={styles.forgotPassword}>
                <a href='#'>Forgot password?</a>
              </div>
            </div>

            <button
              type='submit'
              className={styles.loginButton}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Please wait...' : submitButtonText}
            </button>
          </form>

          {showSignupOption && (
            <>
              <div className={styles.divider}>
                <span>or</span>
              </div>

              <button
                className={styles.createAccountButton}
                onClick={onSignupRedirect}
              >
                Create a new account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginModal
