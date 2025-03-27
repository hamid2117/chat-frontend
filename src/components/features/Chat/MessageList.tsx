import { useEffect, useRef, useState } from 'react'
import styles from './MessageList.module.scss'
import { BsChatDots } from 'react-icons/bs'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import Markdown from 'react-markdown'

interface Attachment {
  id: string
  messageId: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  createdAt: string
  updatedAt: string
}

interface Sender {
  id: string
  displayName: string
  email: string
  profilePicture: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  contentType: string
  textContent: string
  sentAt: string
  editedAt: string | null
  isEdited: boolean
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  sender: Sender
  attachments: Attachment[]
}

// Rest of your MessageListProps remains the same
interface MessageListProps {
  messages: Message[]
  typingUsers: string[]
  onUpdateMessage?: (
    messageId: number,
    content: string
  ) => Promise<Message | null>
  onDeleteMessage?: (messageId: number) => Promise<boolean>
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  typingUsers,
  onUpdateMessage,
  onDeleteMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
        setIsFirstRender(false)
      }, 1)
    }
  }, [isFirstRender, messages.length])

  useEffect(() => {
    if (!isFirstRender && messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        const { scrollHeight, scrollTop, clientHeight } = container
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }, [messages, isFirstRender])

  return (
    <div className={styles.messagesContainer}>
      {messages.length === 0 ? (
        <div className={styles.emptyMessages}>
          <div className={styles.emptyMessagesIcon}>
            <BsChatDots />
          </div>
          <h3>No messages yet</h3>
          <p>Be the first to send a message in this conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.isDeleted ? styles.deleted : ''
            }`}
          >
            <img
              src={msg.sender.profilePicture || 'https://placehold.co/40x40'}
              alt={msg.sender.displayName}
              className={styles.senderAvatar}
            />
            <div className={styles.messageContent}>
              <div className={styles.messageHeader}>
                <span className={styles.senderName}>
                  {msg.sender.displayName}
                </span>
                <span className={styles.timestamp}>
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {msg.isEdited && (
                  <span className={styles.edited}>(edited)</span>
                )}
              </div>

              <div className={styles.messageText}>
                {msg.isDeleted ? (
                  <em className={styles.deletedText}>
                    This message was deleted
                  </em>
                ) : (
                  <Markdown
                    remarkPlugins={[
                      remarkGfm,
                      [remarkEmoji, { emoticon: true }],
                    ]}
                  >
                    {msg.textContent}
                  </Markdown>
                )}
              </div>

              {msg.attachments && msg.attachments.length > 0 && (
                <div className={styles.attachments}>
                  {msg.attachments.map((attachment) => (
                    <div key={attachment.id} className={styles.attachment}>
                      {attachment.fileType.startsWith('image/') ? (
                        <img
                          src={attachment.fileUrl}
                          alt={attachment.fileName}
                          className={styles.attachmentImage}
                        />
                      ) : (
                        <a
                          href={attachment.fileUrl}
                          download={attachment.fileName}
                        >
                          {attachment.fileName}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {typingUsers.length > 0 && (
        <div className={styles.typingIndicator}>
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing...`
            : `${typingUsers.length} people are typing...`}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
