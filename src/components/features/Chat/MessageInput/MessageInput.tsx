import { useState, useEffect, useRef } from 'react'
import {
  BsMic,
  BsCameraVideo,
  BsImage,
  BsPlusLg,
  BsX,
  BsEmojiSmile,
  BsFileEarmarkImage,
  BsFileEarmarkPdf,
  BsFileEarmarkText,
} from 'react-icons/bs'
import { RiSendPlaneFill } from 'react-icons/ri'
import styles from './style.module.scss'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import MarkdownEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'

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
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const mdEditorRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<any | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLDivElement>(null)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!mdEditorRef.current) return

    mdEditorRef.current.insertText(emojiData.emoji)
  }

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

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setFileError(`You can only attach up to ${MAX_ATTACHMENTS} files`)
      return
    }

    const newAttachments: Attachment[] = []

    Array.from(files).forEach((file) => {
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        setFileError(
          'Unsupported file type. Supported types: images, PDF, DOC, DOCX, TXT'
        )
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 10MB limit')
        return
      }

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && attachments.length === 0) {
      return
    }

    const files = attachments.map((att) => att.file)

    try {
      await onSendMessage(message, files)

      setMessage('')
      if (mdEditorRef.current) {
        mdEditorRef.current.setText('')
      }

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

  const handleEditorChange = ({ text }: { text: string }) => {
    setMessage(text)
  }

  const renderHTML = (text: string) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>
        {text}
      </ReactMarkdown>
    )
  }

  const mdEditorToolbar = {
    img: false,
    link: true,
    code: true,
    preview: true,
    expand: false,
    undo: true,
    redo: true,
    save: false,
    subfield: true,
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <BsFileEarmarkImage />
    if (fileType.includes('pdf')) return <BsFileEarmarkPdf />
    return <BsFileEarmarkText />
  }

  return (
    <div className={styles.messageInputContainer}>
      {fileError && (
        <div className={styles.fileError}>
          <BsX
            className={styles.errorIcon}
            onClick={() => setFileError(null)}
          />
          {fileError}
        </div>
      )}

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
        <div className={styles.markdownEditorContainer}>
          <MarkdownEditor
            ref={mdEditorRef}
            value={message}
            style={{ height: '200px' }}
            onChange={handleEditorChange}
            renderHTML={renderHTML}
            placeholder='Type a message...'
            config={{
              view: { menu: true, md: true, html: false },
              canView: {
                menu: true,
                md: true,
                html: false,
                fullScreen: false,
                hideMenu: true,
              },
              toolbar: mdEditorToolbar,
            }}
            plugins={[
              'font-bold',
              'font-italic',
              'list-unordered',
              'list-ordered',
              'block-quote',
              'block-code-inline',
              'block-code-block',
            ]}
          />
        </div>

        <div className={styles.actionToolbar}>
          <div className={styles.actionLeft}>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              multiple
              accept={SUPPORTED_FILE_TYPES.join(',')}
            />

            <BsPlusLg
              className={styles.actionIcon}
              title='Add attachments'
              onClick={openFileSelector}
            />

            <BsImage
              className={styles.actionIcon}
              title='Add image'
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*'
                  fileInputRef.current.click()
                  setTimeout(() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept =
                        SUPPORTED_FILE_TYPES.join(',')
                    }
                  }, 100)
                }
              }}
            />

            <div ref={emojiButtonRef} className={styles.emojiPickerContainer}>
              <BsEmojiSmile
                className={styles.actionIcon}
                title='Add emoji'
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className={styles.emojiPickerWrapper}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
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
