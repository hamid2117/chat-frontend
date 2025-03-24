import { useState, useRef, useEffect } from 'react'
import {
  BsHouseDoor,
  BsBell,
  BsChatDots,
  BsThreeDotsVertical,
  BsPlusLg,
  BsBoxArrowRight,
} from 'react-icons/bs'
import styles from './LeftSidebar.module.scss'
import { useLogout } from '../../hooks/useAuth'
import { UserData } from '../../types/auth.type'

const LeftSidebar: React.FC<{ user: UserData }> = ({ user }) => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const { mutate: logout } = useLogout()
  const avatarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showLogoutDropdown &&
        avatarRef.current &&
        dropdownRef.current &&
        !avatarRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogoutDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLogoutDropdown])

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setShowLogoutDropdown(!showLogoutDropdown)
  }

  const handleLogout = () => {
    logout()
    setShowLogoutDropdown(false)
  }

  return (
    <div className={styles.leftSidebar}>
      <div className={styles.logoContainer}>
        <img
          src='https://placehold.co/30x30'
          alt='Logo'
          className={styles.userAvatar}
        />
      </div>
      <div className={styles.navIcons}>
        <div className={`${styles.navIconWrapper} ${styles.active}`}>
          <BsHouseDoor className={styles.navIcon} />
        </div>
        <div className={styles.navIconWrapper}>
          <BsBell className={styles.navIcon} />
        </div>
        <div className={styles.navIconWrapper}>
          <BsChatDots className={styles.navIcon} />
        </div>
        <div className={styles.navIconWrapper}>
          <BsThreeDotsVertical className={styles.navIcon} />
          <span className={styles.navText}>More</span>
        </div>
      </div>
      <div className={styles.sidebarBottom}>
        <BsPlusLg className={styles.navIcon} />
        <div className={styles.avatarContainer} ref={avatarRef}>
          <img
            src={user.profilePicture}
            alt='User'
            className={styles.userAvatar}
            onClick={handleAvatarClick}
          />

          {showLogoutDropdown && (
            <div className={styles.logoutDropdown} ref={dropdownRef}>
              <div className={styles.logoutOption} onClick={handleLogout}>
                <BsBoxArrowRight className={styles.logoutIcon} />
                <span>Log out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
