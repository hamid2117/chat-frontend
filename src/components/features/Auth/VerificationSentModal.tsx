import { FaEnvelope } from 'react-icons/fa'
import styles from './VerificationSentModal.module.scss'
import messageLogo from '../../../../public/icons/message.svg'

interface VerificationSentModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

const VerificationSentModal: React.FC<VerificationSentModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  // Don't render if not open
  if (!isOpen) return null

  const openGmail = () => {
    window.open('http://localhost:8025', '_blank')
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Verification Sent</h2>

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close modal'
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.messageContainer}>
            <img
              src={messageLogo}
              alt='Message'
              className={styles.messageLogo}
            />
            <p className={styles.thankYouMessage}>Thank you for signing up!</p>
            <p className={styles.verificationInfo}>
              We've sent a verification code to:
            </p>
            <p className={styles.emailAddress}>{email}</p>
            <p className={styles.instructions}>
              Please check your email and follow the instructions to verify your
              account.
            </p>
          </div>

          <button className={styles.gmailButton} onClick={openGmail}>
            <FaEnvelope className={styles.gmailIcon} />
            <span>Open Gmail</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationSentModal
