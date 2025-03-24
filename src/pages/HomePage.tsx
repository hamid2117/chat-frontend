import styles from './HomePage.module.scss'
import Navbar from '../components/layout/Navbar'
import LeftSidebar from '../components/layout/LeftSidebar'
import ChatList from '../components/features/Chat/ChatList'
import ChatContent from '../components/features/Chat/ChatContent'
import { useAuthStatus } from '../hooks/useAuth'

const HomePage = () => {
  const { user } = useAuthStatus()
  // Sample data
  const groupChats = [
    { id: 1, name: 'Log Rocket Group', active: true },
    { id: 2, name: 'Random' },
    { id: 3, name: 'General' },
    { id: 4, name: 'HR' },
  ]

  const directMessages = [
    { id: 1, name: 'Ashir Manzoor' },
    { id: 2, name: 'Fahad Jalal' },
    { id: 3, name: 'Yashua Parvez' },
    { id: 4, name: 'Aneeq Akber' },
  ]

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

  return (
    <div className={styles.chatContainer}>
      <Navbar />

      <div className={styles.mainContent}>
        <LeftSidebar user={user} />
        <ChatList groupChats={groupChats} directMessages={directMessages} />
        <ChatContent
          chatMessages={chatMessages}
          activeChat='Log Rocket Group'
        />
      </div>
    </div>
  )
}

export default HomePage
