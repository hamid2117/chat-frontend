import { BsChevronDown, BsPlusCircle } from 'react-icons/bs'
import styles from './ChatList.module.scss'

interface GroupSectionProps {
  title: string
  items: Array<{
    id: string
    name: string
    picture: string
    active?: boolean
    unreadCount?: number
  }>
  onItemClick: (id: string) => void
  onCreateNew?: () => void
}

const GroupSection: React.FC<GroupSectionProps> = ({
  title,
  items,
  onItemClick,
  onCreateNew,
}) => {
  return (
    <div className={styles.groupSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <BsChevronDown className={styles.dropdownIcon} />
          <p>{title}</p>
        </div>

        <button
          className={styles.addButton}
          onClick={onCreateNew}
          aria-label='Create new group'
        >
          <BsPlusCircle />
        </button>
      </div>
      <div className={styles.groupList}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.groupItem} ${
              item.active ? styles.active : ''
            }`}
            onClick={() => onItemClick(item.id)}
          >
            <img
              src={item.picture || 'https://placehold.co/30x30'}
              alt={item.name}
              className={styles.groupAvatar}
            />
            <p className={styles.groupName}>{item.name}</p>

            {item.unreadCount && item.unreadCount > 0 ? (
              <span className={styles.unreadBadge}>{item.unreadCount}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupSection
