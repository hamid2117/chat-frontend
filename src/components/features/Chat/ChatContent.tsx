import styles from './ChatContent.module.scss'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatContentProps {
  chatMessages: Array<{ id: number; sender: string; content: string }>
  activeChat: string
}

const ChatContent: React.FC<ChatContentProps> = ({
  chatMessages,
  activeChat,
}) => {
  return (
    <div className={styles.chatContent}>
      <ChatHeader title={activeChat} />
      <MessageList messages={chatMessages} />
      <MessageInput />
    </div>
  )
}

export default ChatContent
