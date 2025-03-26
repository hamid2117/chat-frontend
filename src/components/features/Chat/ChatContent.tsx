import styles from './ChatContent.module.scss'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import type { Conversation } from '../../../hooks/useConversations'

interface Message {
  id: number
  sender: string
  content: string
  timestamp?: string
  conversationId: string
  isDeleted?: boolean
}
interface ChatContentProps {
  messages: Message[]
  typingUsers: string[]
  isLoading: boolean
  onSendMessage: (content: string) => Promise<void>
  onUpdateMessage: (
    messageId: number,
    content: string
  ) => Promise<Message | null>
  onDeleteMessage: (messageId: number) => Promise<boolean>
  onTyping: (isTyping: boolean) => void
  activeConversation: Conversation
}

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  typingUsers,
  isLoading,
  onSendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onTyping,
  activeConversation,
}) => {
  return (
    <div className={styles.chatContent}>
      <ChatHeader activeConversation={activeConversation} />

      {isLoading ? (
        <div className={styles.loadingMessages}>Loading messages...</div>
      ) : (
        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          onUpdateMessage={onUpdateMessage}
          onDeleteMessage={onDeleteMessage}
        />
      )}

      <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  )
}

export default ChatContent
