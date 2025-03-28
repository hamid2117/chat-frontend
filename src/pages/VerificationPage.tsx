import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from './VerificationPage.module.scss'
import logo from '../../public/icons/logo.svg'
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import httpClient from '../api/httpClient'

const VerificationPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const verificationAttemptedRef = useRef(false)

  useEffect(() => {
    if (verificationAttemptedRef.current) return

    const verifyAccount = async () => {
      verificationAttemptedRef.current = true

      try {
        const queryParams = new URLSearchParams(location.search)
        const email = queryParams.get('email')
        const token = queryParams.get('token')

        if (!email || !token) {
          setError('Invalid verification link. Missing email or token.')
          setIsVerifying(false)
          return
        }

        await httpClient.post('/auth/verify-email', {
          email,
          verificationToken: token,
        })

        setIsVerified(true)
        setIsVerifying(false)
        toast.success('Your account has been successfully verified!')
      } catch (err: any) {
        console.error('Verification error:', err)
        setError(
          err?.response?.data?.message ||
            'Verification failed. This link may be expired or invalid.'
        )
        setIsVerifying(false)
        toast.error('Verification failed. Please try again.')
      }
    }

    verifyAccount()
  }, [location.search])

  const handleRedirectToLogin = () => {
    navigate('/')
  }

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.verificationCard}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <h1>Pulse</h1>
            <span>
              <img src={logo} alt='Pulse Logo' className={styles.logoGraph} />
            </span>
          </div>
        </div>

        <div className={styles.contentSection}>
          {isVerifying ? (
            <div className={styles.loadingState}>
              <FaSpinner className={styles.spinnerIcon} />
              <h2>Verifying your account...</h2>
              <p>Please wait while we verify your email address.</p>
            </div>
          ) : isVerified ? (
            <div className={styles.successState}>
              <FaCheckCircle className={styles.successIcon} />
              <h2>Email Verified!</h2>
              <p>
                Your account has been successfully verified. You can now log in
                to your account.
              </p>
              <button
                className={styles.actionButton}
                onClick={handleRedirectToLogin}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className={styles.errorState}>
              <FaExclamationTriangle className={styles.errorIcon} />
              <h2>Verification Failed</h2>
              <p>{error || 'An error occurred during verification.'}</p>
              <p className={styles.helpText}>
                The verification link may have expired or is invalid.
              </p>
              <button
                className={styles.actionButton}
                onClick={handleRedirectToLogin}
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerificationPage
