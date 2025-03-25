import styles from './HomePage.module.scss'
import Navbar from '../components/layout/Navbar'
import LeftSidebar from '../components/layout/LeftSidebar'
import ChatList from '../components/features/Chat/ChatList'
import ChatContent from '../components/features/Chat/ChatContent'
import { useAuthStatus } from '../hooks/useAuth'
import { useConversations } from '../hooks/useConversations'
import { useMessages } from '../hooks/useMessages'
import InitialHomeImg from '../../public/icons/initial-home.svg'
import { useState } from 'react'

const HomePage = () => {
  const { user } = useAuthStatus()
  const { groupChats, directMessages, isLoading } = useConversations()
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null)

  // Use the messages hook
  const {
    messages,
    loading: messagesLoading,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    setTypingStatus,
    typingUsers,
  } = useMessages()

  const activeConversation =
    groupChats.find((g) => g.id === activeConversationId) ||
    directMessages.find((d) => d.id === activeConversationId) ||
    (groupChats.length > 0 ? groupChats[0] : null) ||
    (directMessages.length > 0 ? directMessages[0] : null)
  console.log('messages', messages)
  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id)
    // Fetch messages for the selected conversation
    getMessages(id)
  }

  // Handler to send a new message
  const handleSendMessage = async (content: string) => {
    if (activeConversationId) {
      await createMessage(activeConversationId, content)
    }
  }

  return (
    <div className={styles.chatContainer}>
      <Navbar />

      <div className={styles.mainContent}>
        <LeftSidebar user={user} />

        {isLoading ? (
          <div className={styles.loading}>Loading conversations...</div>
        ) : (
          <>
            <ChatList
              groupChats={groupChats}
              directMessages={directMessages}
              onConversationSelect={handleConversationSelect}
              activeConversationId={activeConversationId}
            />

            {activeConversation ? (
              <ChatContent
                messages={messages}
                typingUsers={typingUsers}
                activeChat={activeConversation.name}
                onSendMessage={handleSendMessage}
                onUpdateMessage={updateMessage}
                onDeleteMessage={deleteMessage}
                onTyping={(isTyping) =>
                  activeConversationId &&
                  setTypingStatus(activeConversationId, isTyping)
                }
                isLoading={messagesLoading}
              />
            ) : (
              <div className={styles.emptyState}>
                <img src={InitialHomeImg} alt='Welcome to Pulse' />
                <h2>pulse</h2>
                <h3>Connect, Communicate, Create</h3>
                <h3>
                  Your journey with <span>pulse</span> begins here!
                </h3>
                <button
                  className={styles.getStartedButton}
                  onClick={() =>
                    setActiveConversationId(
                      groupChats[0]?.id || directMessages[0]?.id
                    )
                  }
                >
                  Start Chatting
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
