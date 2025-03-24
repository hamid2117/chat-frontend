import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './SignupModal.module.scss'
import { SignupFormInputs, SignupModalProps } from '../../../types/auth.type'

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSignupSuccess,
  onLoginRedirect,
  title = 'Signup',
  submitButtonText = 'Signup',
  showLoginOption = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>()

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      // Here you would typically make an API call to register the user
      console.log('Signup form submitted with:', data)

      // If signup is successful
      if (onSignupSuccess) {
        onSignupSuccess(data)
      }
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  // Don't render anything if the modal is not open
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close signup modal'
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.inputGroup}>
              <input
                type='text'
                placeholder='Email Address / Phone Number'
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
                type='text'
                placeholder='Display Name'
                className={`${styles.inputField} ${
                  errors.name ? styles.inputError : ''
                }`}
                {...register('name', {
                  required: 'Display name is required',
                  minLength: {
                    value: 2,
                    message: 'Display name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <p className={styles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type='text'
                placeholder='Username'
                className={`${styles.inputField} ${
                  errors.username ? styles.inputError : ''
                }`}
                {...register('username', {
                  required: 'Username is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message:
                      'Username can only contain letters, numbers, underscores and hyphens',
                  },
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
              />
              {errors.username && (
                <p className={styles.errorMessage}>{errors.username.message}</p>
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
            </div>

            <button
              type='submit'
              className={styles.signupButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : submitButtonText}
            </button>
          </form>

          {showLoginOption && (
            <>
              <div className={styles.divider}>
                <span>or</span>
              </div>

              <button
                className={styles.loginAccountButton}
                onClick={onLoginRedirect}
              >
                Already have an account? Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignupModal
