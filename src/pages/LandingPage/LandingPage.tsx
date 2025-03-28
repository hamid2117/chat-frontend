import { useEffect, useState } from 'react'
import styles from './style.module.scss'
import worldImage from '../../../public/icons/hero.svg'
import logo from '../../../public/icons/logo.svg'
import { FaChevronDown } from 'react-icons/fa'
import { LoginFormInputs, SignupFormInputs } from '../../types/auth.type'
import LoginModal from '../../components/features/Auth/LoginModal'
import SignupModal from '../../components/features/Auth/SignupModal'
import { useLogin, useSignup } from '../../hooks/useAuth'
import VerificationSentModal from '../../components/features/Auth/VerificationSentModal/VerificationSentModal'

const HeroPulse: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const { mutate: login, isPending: isLoggingIn } = useLogin()
  const { mutate: signUp, isPending: isSigningUp, isSuccess } = useSignup()

  const handleLoginSuccess = (data: LoginFormInputs) => {
    login(data)
  }

  const handleSignupSuccess = async (data: SignupFormInputs) => {
    signUp(data)
    setUserEmail(data.email)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsSignupModalOpen(false)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const openSignupModal = () => {
    setIsSignupModalOpen(true)
    setIsLoginModalOpen(false)
  }

  const closeSignupModal = () => {
    setIsSignupModalOpen(false)
  }
  useEffect(() => {
    if (isSuccess) {
      closeSignupModal()
      setShowVerificationModal(true)
    }
  }, [isSuccess])

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Pulse</h1>
          <span>
            <img src={logo} alt='' className={styles.logoGraph} />
          </span>
        </div>
        <nav className={styles.navigation}>
          <ul>
            <li>
              <a href='#'>Privacy</a>
            </li>
            <li>
              <a href='#'>Help Center</a>
            </li>
            <li>
              <a href='#'>Pulse Web</a>
            </li>
            <li className={styles.dropdown}>
              <a href='#'>
                Download <FaChevronDown />
              </a>
            </li>
          </ul>
          <button className={styles.tryPulseBtn}>Try Pulse</button>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.leftContent}>
          <h2 className={styles.title}>Communicate, Anywhere, Anytime</h2>
          <p className={styles.description}>
            Connect effortlessly across all devices with Pulse. Break free from
            limitations and redefine communication, anytime, anywhere.
          </p>
          <div className={styles.buttons}>
            <button className={styles.signupBtn} onClick={openSignupModal}>
              Signup
            </button>
            <button className={styles.loginBtn} onClick={openLoginModal}>
              Login
            </button>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.worldIllustration}>
            <img src={worldImage} alt='World Map' className={styles.worldMap} />
          </div>
        </div>
      </main>

      <div className={styles.scrollIndicator}>
        <FaChevronDown />
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        isLoggingIn={isLoggingIn}
        onLoginSuccess={handleLoginSuccess}
        onSignupRedirect={openSignupModal}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        isSigningUp={isSigningUp}
        onSignupSuccess={handleSignupSuccess}
        onLoginRedirect={openLoginModal}
      />

      <VerificationSentModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={userEmail}
      />
    </div>
  )
}

export default HeroPulse
