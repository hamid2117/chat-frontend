import { useState } from 'react'
import { BsMic, BsCameraVideo, BsThreeDotsVertical } from 'react-icons/bs'
import styles from './ChatHeader.module.scss'
import EditGroupModal from './EditGroupModal'
import type { Conversation } from '../../../hooks/useConversations'
import { useQueryClient } from '@tanstack/react-query' // Add this import

interface ChatHeaderProps {
  activeConversation: Conversation
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeConversation }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const queryClient = useQueryClient() // Add QueryClient for refetching

  const handleEditClick = async () => {
    setIsEditModalOpen(true)
    setMenuOpen(false)
  }

  // Add a function to handle successful updates
  const handleUpdateSuccess = () => {
    // Invalidate conversation queries to refetch data
    queryClient.invalidateQueries(['conversations'])
    queryClient.invalidateQueries(['conversation', activeConversation.id])
  }

  return (
    <>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>
          <span>{activeConversation.name}</span>
          <span style={{ marginLeft: '6px' }} className={styles.arrow}>
            ▶
          </span>
        </div>
        <div className={styles.chatControls}>
          <div className={styles.userAvatars}>
            {activeConversation.participants
              ?.slice(0, 3)
              .map((participant, index) => (
                <img
                  key={participant.id}
                  src={
                    participant.profilePicture || 'https://placehold.co/30x30'
                  }
                  alt={participant.displayName}
                  className={styles.userAvatar}
                  style={{ zIndex: 3 - index }}
                />
              ))}
            {activeConversation.participants?.length > 3 && (
              <div className={styles.moreAvatars}>
                +{activeConversation.participants.length - 3}
              </div>
            )}
          </div>
          <BsMic className={styles.controlIcon} />
          <BsCameraVideo className={styles.controlIcon} />

          {activeConversation.type === 'GROUP' && (
            <div className={styles.menuContainer}>
              <BsThreeDotsVertical
                className={styles.controlIcon}
                style={{ marginTop: '5px' }}
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleEditClick}>Edit Group</button>
                  <button className={styles.leaveGroup}>Leave Group</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && activeConversation && (
        <EditGroupModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          conversationId={activeConversation.id}
          initialData={{
            name: activeConversation.name,
            description: activeConversation.description || '',
            groupPicture: activeConversation.picture,
            participants: activeConversation.participants || [],
          }}
          onUpdate={handleUpdateSuccess} // Pass the update handler
        />
      )}
    </>
  )
}

export default ChatHeader
