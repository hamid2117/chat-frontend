import { BsPerson, BsChatDots } from 'react-icons/bs'
import styles from './ChatList.module.scss'
import GroupSection from './GroupSection'

interface ChatListProps {
  groupChats: Array<{ id: number; name: string; active?: boolean }>
  directMessages: Array<{ id: number; name: string }>
}

const ChatList: React.FC<ChatListProps> = ({ groupChats, directMessages }) => {
  return (
    <div className={styles.chatList}>
      {/* Header */}
      <div className={styles.chatListHeader}>
        <h2>QLU Recruiting</h2>
      </div>

      {/* Main Navigation */}
      <div className={styles.mainMenu}>
        <div className={styles.menuItem}>
          <BsPerson className={styles.menuIcon} />
          <p>Groups</p>
        </div>
        <div className={styles.menuItem}>
          <BsChatDots className={styles.menuIcon} />
          <p>Direct Messages</p>
        </div>
      </div>

      {/* Groups section */}
      <GroupSection title='Groups' items={groupChats} />

      {/* Direct Messages section */}
      <GroupSection title='Direct Messages' items={directMessages} />
    </div>
  )
}

export default ChatList
