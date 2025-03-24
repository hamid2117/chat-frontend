import { BsChevronDown } from 'react-icons/bs'
import styles from './GroupSection.module.scss'

interface GroupSectionProps {
  title: string
  items: Array<{ id: number; name: string; active?: boolean }>
}

const GroupSection: React.FC<GroupSectionProps> = ({ title, items }) => {
  return (
    <div className={styles.groupSection}>
      <div className={styles.sectionHeader}>
        <BsChevronDown className={styles.dropdownIcon} />
        <p>{title}</p>
      </div>
      <div className={styles.groupList}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.groupItem} ${
              item.active ? styles.active : ''
            }`}
          >
            <img
              src='https://placehold.co/30x30'
              alt={item.name}
              className={styles.groupAvatar}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupSection
