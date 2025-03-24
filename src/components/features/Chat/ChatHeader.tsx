import { BsMic, BsCameraVideo } from 'react-icons/bs'
import styles from './ChatHeader.module.scss'

interface ChatHeaderProps {
  title: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatTitle}>
        <span>{title}</span>
        <span className={styles.arrow}>▶</span>
      </div>
      <div className={styles.chatControls}>
        <div className={styles.userAvatars}>
          <img
            src='https://placehold.co/30x30'
            alt='User'
            className={styles.userAvatar}
          />
          <img
            src='https://placehold.co/30x30'
            alt='User'
            className={styles.userAvatar}
          />
          <img
            src='https://placehold.co/30x30'
            alt='User'
            className={styles.userAvatar}
          />
        </div>
        <BsMic className={styles.controlIcon} />
        <BsCameraVideo className={styles.controlIcon} />
      </div>
    </div>
  )
}

export default ChatHeader
