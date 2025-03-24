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

const MessageInput = () => {
  return (
    <div className={styles.messageInputContainer}>
      <div className={styles.formattingToolbar}>
        <div className={styles.toolbarLeft}>
          <BsTypeBold className={styles.toolbarIcon} />
          <BsTypeItalic className={styles.toolbarIcon} />
          <BsLink45Deg className={styles.toolbarIcon} />
          <div className={styles.divider}></div>
          <BsListUl className={styles.toolbarIcon} />
          <BsListOl className={styles.toolbarIcon} />
          <div className={styles.divider}></div>
          <BsCode className={styles.toolbarIcon} />
        </div>
      </div>

      <div className={styles.messagePlaceholder}>
        <p className={styles.placeholderText}>Message Log Rocket Updates</p>
      </div>

      <div className={styles.actionToolbar}>
        <div className={styles.actionLeft}>
          <BsPlusLg className={styles.actionIcon} />
          <BsTypeItalic className={styles.actionIcon} />
          <BsEmojiSmile className={styles.actionIcon} />
          <div className={styles.divider}></div>
          <BsCameraVideo className={styles.actionIcon} />
          <BsMic className={styles.actionIcon} />
          <div className={styles.divider}></div>
          <BsImage className={styles.actionIcon} />
        </div>
        <div className={styles.actionRight}>
          <RiSendPlaneFill className={styles.sendIcon} />
        </div>
      </div>
    </div>
  )
}

export default MessageInput
