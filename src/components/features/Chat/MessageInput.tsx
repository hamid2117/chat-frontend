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
  BsX,
  BsFileEarmarkText,
  BsFileEarmarkImage,
  BsFileEarmarkPdf,
} from 'react-icons/bs'
import { RiSendPlaneFill } from 'react-icons/ri'
import styles from './MessageInput.module.scss'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_ATTACHMENTS = 5

const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

interface Attachment {
  file: File
  id: string
  previewUrl?: string
}

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>
  onTyping: (isTyping: boolean) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
}) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<any | null>(null)

  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true)
      onTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        onTyping(false)
      }
    }, 2000)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, isTyping, onTyping])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileError(null)

    if (!files || files.length === 0) return

    // Check if adding new files would exceed the limit
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setFileError(`You can only attach up to ${MAX_ATTACHMENTS} files`)
      return
    }

    // Process each file
    const newAttachments: Attachment[] = []

    Array.from(files).forEach((file) => {
      // Check file type
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        setFileError(
          'Unsupported file type. Supported types: images, PDF, DOC, DOCX, TXT'
        )
        return
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 10MB limit')
        return
      }

      // Create a preview URL for images
      let previewUrl
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file)
      }

      newAttachments.push({
        file,
        id: `attachment-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        previewUrl,
      })
    })

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments])
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const updated = prev.filter((att) => att.id !== id)
      const attachment = prev.find((att) => att.id === id)
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl)
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && attachments.length === 0) {
      return
    }

    const files = attachments.map((att) => att.file)

    try {
      await onSendMessage(message, files)

      setMessage('')

      attachments.forEach((att) => {
        if (att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl)
        }
      })
      setAttachments([])

      onTyping(false)
      setIsTyping(false)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

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

  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      setCursorPosition(null)
    }
  }, [cursorPosition, message])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <BsFileEarmarkImage />
    if (fileType.includes('pdf')) return <BsFileEarmarkPdf />
    return <BsFileEarmarkText />
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

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

      {/* Display file error if any */}
      {fileError && (
        <div className={styles.fileError}>
          <BsX
            className={styles.errorIcon}
            onClick={() => setFileError(null)}
          />
          {fileError}
        </div>
      )}

      {/* Display attachment previews */}
      {attachments.length > 0 && (
        <div className={styles.attachmentPreviews}>
          {attachments.map((attachment) => (
            <div key={attachment.id} className={styles.attachmentPreview}>
              {attachment.previewUrl ? (
                <div className={styles.imagePreview}>
                  <img src={attachment.previewUrl} alt={attachment.file.name} />
                  <button
                    className={styles.removeAttachment}
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <BsX />
                  </button>
                </div>
              ) : (
                <div className={styles.filePreview}>
                  {getFileIcon(attachment.file.type)}
                  <span className={styles.fileName}>
                    {attachment.file.name}
                  </span>
                  <span className={styles.fileSize}>
                    {(attachment.file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    className={styles.removeAttachment}
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <BsX />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
            {/* File input (hidden) */}
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              multiple
              accept={SUPPORTED_FILE_TYPES.join(',')}
            />

            {/* Attachment button */}
            <BsPlusLg
              className={styles.actionIcon}
              title='Add attachments'
              onClick={openFileSelector}
            />

            {/* Direct image upload button */}
            <BsImage
              className={styles.actionIcon}
              title='Add image'
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*'
                  fileInputRef.current.click()
                  // Reset accept after click
                  setTimeout(() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept =
                        SUPPORTED_FILE_TYPES.join(',')
                    }
                  }, 100)
                }
              }}
            />

            {/* Other action buttons */}
            <BsEmojiSmile className={styles.actionIcon} title='Add emoji' />
            <div className={styles.divider}></div>
            <BsCameraVideo
              className={styles.actionIcon}
              title='Start video call'
            />
            <BsMic className={styles.actionIcon} title='Record audio' />
          </div>

          <div className={styles.actionRight}>
            <button
              type='submit'
              className={`${styles.sendButton} ${
                attachments.length > 0 ? styles.hasAttachments : ''
              }`}
              disabled={!message.trim() && attachments.length === 0}
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
