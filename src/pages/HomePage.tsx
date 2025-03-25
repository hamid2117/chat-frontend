import styles from './HomePage.module.scss'
import Navbar from '../components/layout/Navbar'
import LeftSidebar from '../components/layout/LeftSidebar'
import ChatList from '../components/features/Chat/ChatList'
import ChatContent from '../components/features/Chat/ChatContent'
import { useAuthStatus } from '../hooks/useAuth'
import { useConversations } from '../hooks/useConversations'
import InitialHomeImg from '../../public/icons/initial-home.svg'
import { useState } from 'react'

const HomePage = () => {
  const { user } = useAuthStatus()
  const { groupChats, directMessages, isLoading } = useConversations()
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null)

  // Find the active conversation (either from state or default to first one)
  const activeConversation =
    groupChats.find((g) => g.id === activeConversationId) ||
    directMessages.find((d) => d.id === activeConversationId) ||
    (groupChats.length > 0 ? groupChats[0] : null) ||
    (directMessages.length > 0 ? directMessages[0] : null)

  const chatMessages = [
    {
      id: 1,
      sender: 'Yashua Parvez',
      content:
        'We really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience.',
    },
    {
      id: 2,
      sender: 'Muhammad Salman',
      content:
        'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imantariq',
    },
    {
      id: 3,
      sender: 'Aiman Tariq',
      content: 'Are you following up on these tickets being created?',
    },
  ]

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id)
    // Here you would also fetch messages for this conversation
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
                chatMessages={chatMessages}
                activeChat={activeConversation.name}
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
