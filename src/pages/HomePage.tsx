import {
  BsHouseDoor,
  BsBell,
  BsChatDots,
  BsThreeDotsVertical,
  BsPlusLg,
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
  BsChevronDown,
  BsPerson,
} from 'react-icons/bs'
import { RiSendPlaneFill } from 'react-icons/ri'
import styles from './HomePage.module.scss'

const Hero = () => {
  // Sample data
  const groupChats = [
    { id: 1, name: 'Log Rocket Group', active: true },
    { id: 2, name: 'Random' },
    { id: 3, name: 'General' },
    { id: 4, name: 'HR' },
  ]

  const directMessages = [
    { id: 1, name: 'Ashir Manzoor' },
    { id: 2, name: 'Fahad Jalal' },
    { id: 3, name: 'Yashua Parvez' },
    { id: 4, name: 'Aneeq Akber' },
  ]

  const chatMessages = [
    {
      id: 1,
      sender: 'Yashua Parvez',
      content:
        'We really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience.',
    },
    {
      id: 2,
      sender: 'Muhammad Salman',
      content:
        'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imantariq',
    },
    {
      id: 3,
      sender: 'Aiman Tariq',
      content: 'Are you following up on these tickets being created?',
    },
  ]

  return (
    <div className={styles.chatContainer}>
      {/* Top Navbar - Full Width */}
      <div className={styles.topNavbar}>
        <div className={styles.searchContainer}>
          <input
            type='text'
            placeholder='Search QLU Recruiting'
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Sidebar Navigation */}
        <div className={styles.leftSidebar}>
          <div className={styles.logoContainer}>
            <img
              src='https://via.placeholder.com/40'
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
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className={styles.userAvatar}
            />
          </div>
        </div>

        {/* Chat List Section */}
        <div className={styles.chatList}>
          {/* Header */}
          <div className={styles.chatListHeader}>
            <h2>QLU Recruiting</h2>
          </div>

          {/* Main Navigation */}
          <div className={styles.mainMenu}>
            <div className={styles.menuItem}>
              <BsPerson className={styles.menuIcon} />
              <p>Groups</p>
            </div>
            <div className={styles.menuItem}>
              <BsChatDots className={styles.menuIcon} />
              <p>Direct Messages</p>
            </div>
          </div>

          {/* Groups section */}
          <div className={styles.groupSection}>
            <div className={styles.sectionHeader}>
              <BsChevronDown className={styles.dropdownIcon} />
              <p>Groups</p>
            </div>
            <div className={styles.groupList}>
              {groupChats.map((group) => (
                <div
                  key={group.id}
                  className={`${styles.groupItem} ${
                    group.active ? styles.active : ''
                  }`}
                >
                  <img
                    src='https://via.placeholder.com/30'
                    alt='Group'
                    className={styles.groupAvatar}
                  />
                  <p>{group.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages section */}
          <div className={styles.groupSection}>
            <div className={styles.sectionHeader}>
              <BsChevronDown className={styles.dropdownIcon} />
              <p>Direct Messages</p>
            </div>
            <div className={styles.groupList}>
              {directMessages.map((dm) => (
                <div key={dm.id} className={styles.groupItem}>
                  <img
                    src='https://via.placeholder.com/30'
                    alt='User'
                    className={styles.groupAvatar}
                  />
                  <p>{dm.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Content Area */}
        <div className={styles.chatContent}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <span>Log Rocket Group</span>
              <span className={styles.arrow}>▶</span>
            </div>
            <div className={styles.chatControls}>
              <div className={styles.userAvatars}>
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles.userAvatar}
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles.userAvatar}
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles.userAvatar}
                />
              </div>
              <BsMic className={styles.controlIcon} />
              <BsCameraVideo className={styles.controlIcon} />
            </div>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={styles.message}>
                <img
                  src='https://via.placeholder.com/40'
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

          {/* Message Input Container */}
          <div className={styles.messageInputContainer}>
            {/* Upper formatting toolbar */}
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

            {/* Message input field */}
            <div className={styles.messagePlaceholder}>
              <p className={styles.placeholderText}>
                Message Log Rocket Updates
              </p>
            </div>

            {/* Lower action toolbar */}
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
        </div>
      </div>
    </div>
  )
}

export default Hero
