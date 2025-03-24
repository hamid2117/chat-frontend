import styles from './MessageList.module.scss'

interface MessageListProps {
  messages: Array<{ id: number; sender: string; content: string }>
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg) => (
        <div key={msg.id} className={styles.message}>
          <img
            src='https://placehold.co/40x40'
            alt={msg.sender}
            className={styles.senderAvatar}
          />
          <div className={styles.messageContent}>
            <div className={styles.senderName}>{msg.sender}</div>
            <div className={styles.messageText}>{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
