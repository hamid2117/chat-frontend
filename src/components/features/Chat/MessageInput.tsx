import { useState, useEffect, useRef } from 'react'
import {
  BsTypeBold,
  BsTypeItalic,
  BsLink45Deg,
  BsListUl,
  BsListOl,
  BsCode,
  BsEmojiSmile,
  BsMic,
  BsCameraVideo,
  BsImage,
  BsPlusLg,
} from 'react-icons/bs'
import { RiSendPlaneFill } from 'react-icons/ri'
import styles from './MessageInput.module.scss'

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  onTyping: (isTyping: boolean) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
}) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<any | null>(null)

  // Handle typing indicator
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true)
      onTyping(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to clear typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        onTyping(false)
      }
    }, 2000) // 2 seconds without typing considered stopped typing

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, isTyping, onTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      await onSendMessage(message)
      setMessage('')
      onTyping(false)
      setIsTyping(false)
    }
  }

  // Format text with markdown
  const formatText = (formatType: string) => {
    if (!inputRef.current) return

    const input = inputRef.current
    const start = input.selectionStart
    const end = input.selectionEnd
    const selectedText = message.substring(start, end)

    let formattedText = ''
    let newCursorPos = 0

    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`
        newCursorPos = start + 2
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        newCursorPos = start + 1
        break
      case 'link':
        formattedText = `[${selectedText}](url)`
        newCursorPos = end + 3
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        newCursorPos = start + 1
        break
      default:
        return
    }

    const newMessage =
      message.substring(0, start) + formattedText + message.substring(end)
    setMessage(newMessage)

    // Set focus and cursor position after state update
    setCursorPosition(
      selectedText
        ? end + formattedText.length - selectedText.length
        : newCursorPos
    )
  }

  // Set cursor position after formatting
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      setCursorPosition(null)
    }
  }, [cursorPosition, message])

  return (
    <div className={styles.messageInputContainer}>
      <div className={styles.formattingToolbar}>
        <div className={styles.toolbarLeft}>
          <BsTypeBold
            className={styles.toolbarIcon}
            onClick={() => formatText('bold')}
          />
          <BsTypeItalic
            className={styles.toolbarIcon}
            onClick={() => formatText('italic')}
          />
          <BsLink45Deg
            className={styles.toolbarIcon}
            onClick={() => formatText('link')}
          />
          <div className={styles.divider}></div>
          <BsListUl className={styles.toolbarIcon} />
          <BsListOl className={styles.toolbarIcon} />
          <div className={styles.divider}></div>
          <BsCode
            className={styles.toolbarIcon}
            onClick={() => formatText('code')}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.messageInput}
          rows={3}
        />

        <div className={styles.actionToolbar}>
          <div className={styles.actionLeft}>
            <BsPlusLg className={styles.actionIcon} title='Add attachments' />
            <BsEmojiSmile className={styles.actionIcon} title='Add emoji' />
            <div className={styles.divider}></div>
            <BsCameraVideo
              className={styles.actionIcon}
              title='Start video call'
            />
            <BsMic className={styles.actionIcon} title='Record audio' />
            <div className={styles.divider}></div>
            <BsImage className={styles.actionIcon} title='Add image' />
          </div>
          <div className={styles.actionRight}>
            <button
              type='submit'
              className={styles.sendButton}
              disabled={!message.trim()}
              title='Send message'
            >
              <RiSendPlaneFill className={styles.sendIcon} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MessageInput
