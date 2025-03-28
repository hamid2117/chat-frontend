import { useState } from 'react'
import { BsPerson, BsChatDots } from 'react-icons/bs'
import styles from './style.module.scss'
import GroupSection from '../GroupSection'
import CreateGroupConversationModal from '../GroupConversationModal'
import CreateDirectConversationModal from '../DirectConversationModal'

interface ChatListProps {
  groupChats: Array<{
    id: string
    name: string
    picture: string
    unreadCount?: number
  }>
  directMessages: Array<{
    id: string
    name: string
    picture: string
    unreadCount?: number
  }>
  onConversationSelect: (id: string) => void
  activeConversationId: string | null
}

const ChatList: React.FC<ChatListProps> = ({
  groupChats,
  directMessages,
  onConversationSelect,
  activeConversationId,
}) => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isCreateDirectModalOpen, setIsCreateDirectModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<
    'groups' | 'directMessages' | null
  >(null)

  const toggleSection = (section: 'groups' | 'directMessages') => {
    if (activeSection === section) {
      setActiveSection(null)
    } else {
      setActiveSection(section)
    }
  }

  return (
    <div className={styles.chatList}>
      <div className={styles.chatListHeader}>
        <h2>QLU Recruiting</h2>
      </div>

      <div className={styles.mainMenu}>
        <div
          className={`${styles.menuItem} ${
            activeSection === 'groups' ? styles.active : ''
          }`}
          onClick={() => toggleSection('groups')}
        >
          <BsPerson className={styles.menuIcon} />
          <p>Groups</p>
        </div>
        <div
          className={`${styles.menuItem} ${
            activeSection === 'directMessages' ? styles.active : ''
          }`}
          onClick={() => toggleSection('directMessages')}
        >
          <BsChatDots className={styles.menuIcon} />
          <p>Direct Messages</p>
        </div>
      </div>

      {(activeSection === null || activeSection === 'groups') && (
        <GroupSection
          title='Groups'
          items={groupChats.map((chat) => ({
            id: chat.id,
            name: chat.name,
            picture: chat.picture,
            active: chat.id === activeConversationId,
            unreadCount: chat.unreadCount,
          }))}
          onItemClick={onConversationSelect}
          onCreateNew={() => setIsCreateGroupModalOpen(true)}
        />
      )}

      {(activeSection === null || activeSection === 'directMessages') && (
        <GroupSection
          title='Direct Messages'
          items={directMessages.map((dm) => ({
            id: dm.id,
            name: dm.name,
            picture: dm.picture,
            active: dm.id === activeConversationId,
            unreadCount: dm.unreadCount,
          }))}
          onItemClick={onConversationSelect}
          onCreateNew={() => setIsCreateDirectModalOpen(true)}
        />
      )}

      <CreateGroupConversationModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />

      <CreateDirectConversationModal
        isOpen={isCreateDirectModalOpen}
        onClose={() => setIsCreateDirectModalOpen(false)}
      />
    </div>
  )
}

export default ChatList
