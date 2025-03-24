import { useState } from 'react'
import styles from './LandingPage.module.scss'
import worldImage from '../../public/icons/hero.svg'
import logo from '../../public/icons/logo.svg'
import { FaChevronDown } from 'react-icons/fa'
import { LoginFormInputs, SignupFormInputs } from '../types/auth.type'
import LoginModal from '../components/features/Auth/LoginModal'
import SignupModal from '../components/features/Auth/SignupModal'

const HeroPulse: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  // Modal control functions
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

  // Auth handlers
  const handleLoginSuccess = (data: LoginFormInputs) => {
    console.log('Login successful:', data)
    closeLoginModal()
    // Here you would typically:
    // 1. Store auth token in localStorage/cookies
    // 2. Update auth context/state
    // 3. Redirect user or show authenticated content
  }

  const handleSignupSuccess = (data: SignupFormInputs) => {
    console.log('Signup successful:', data)
    closeSignupModal()
    // Typically you might:
    // 1. Show a welcome/verification message
    // 2. Automatically log the user in
    // 3. Redirect to profile completion
  }

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
        onLoginSuccess={handleLoginSuccess}
        onSignupRedirect={openSignupModal}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onSignupSuccess={handleSignupSuccess}
        onLoginRedirect={openLoginModal}
      />
    </div>
  )
}

export default HeroPulse
