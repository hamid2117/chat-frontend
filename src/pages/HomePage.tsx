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
    <div className={styles['chat-container']}>
      {/* Top Navbar - Full Width */}
      <div className={styles['top-navbar']}>
        <div className={styles['search-container']}>
          <input
            type='text'
            placeholder='Search QLU Recruiting'
            className={styles['search-input']}
          />
        </div>
      </div>

      <div className={styles['main-content']}>
        {/* Left Sidebar Navigation */}
        <div className={styles['left-sidebar']}>
          <div className={styles['logo-container']}>
            <img
              src='https://via.placeholder.com/40'
              alt='Logo'
              className={styles['user-avatar']}
            />
          </div>
          <div className={styles['nav-icons']}>
            <div
              className={`${styles['nav-icon-wrapper']} ${styles['active']}`}
            >
              <BsHouseDoor className={styles['nav-icon']} />
            </div>
            <div className={styles['nav-icon-wrapper']}>
              <BsBell className={styles['nav-icon']} />
            </div>
            <div className={styles['nav-icon-wrapper']}>
              <BsChatDots className={styles['nav-icon']} />
            </div>
            <div className={styles['nav-icon-wrapper']}>
              <BsThreeDotsVertical className={styles['nav-icon']} />
              <span className={styles['nav-text']}>More</span>
            </div>
          </div>
          <div className={styles['sidebar-bottom']}>
            <BsPlusLg className={styles['nav-icon']} />
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className={styles['user-avatar']}
            />
          </div>
        </div>

        {/* Chat List Section */}
        <div className={styles['chat-list']}>
          {/* Header */}
          <div className={styles['chat-list-header']}>
            <h2>QLU Recruiting</h2>
          </div>

          {/* Main Navigation */}
          <div className={styles['main-menu']}>
            <div className={styles['menu-item']}>
              <BsPerson className={styles['menu-icon']} />
              <p>Groups</p>
            </div>
            <div className={styles['menu-item']}>
              <BsChatDots className={styles['menu-icon']} />
              <p>Direct Messages</p>
            </div>
          </div>

          {/* Groups section */}
          <div className={styles['group-section']}>
            <div className={styles['section-header']}>
              <BsChevronDown className={styles['dropdown-icon']} />
              <p>Groups</p>
            </div>
            <div className={styles['group-list']}>
              {groupChats.map((group) => (
                <div
                  key={group.id}
                  className={`${styles['group-item']} ${
                    group.active ? styles['active'] : ''
                  }`}
                >
                  <img
                    src='https://via.placeholder.com/30'
                    alt='Group'
                    className={styles['group-avatar']}
                  />
                  <p>{group.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages section */}
          <div className={styles['group-section']}>
            <div className={styles['section-header']}>
              <BsChevronDown className={styles['dropdown-icon']} />
              <p>Direct Messages</p>
            </div>
            <div className={styles['group-list']}>
              {directMessages.map((dm) => (
                <div key={dm.id} className={styles['group-item']}>
                  <img
                    src='https://via.placeholder.com/30'
                    alt='User'
                    className={styles['group-avatar']}
                  />
                  <p>{dm.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Content Area */}
        <div className={styles['chat-content']}>
          {/* Chat Header */}
          <div className={styles['chat-header']}>
            <div className={styles['chat-title']}>
              <span>Log Rocket Group</span>
              <span className={styles['arrow']}>▶</span>
            </div>
            <div className={styles['chat-controls']}>
              <div className={styles['user-avatars']}>
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles['user-avatar']}
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles['user-avatar']}
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className={styles['user-avatar']}
                />
              </div>
              <BsMic className={styles['control-icon']} />
              <BsCameraVideo className={styles['control-icon']} />
            </div>
          </div>

          {/* Messages Container */}
          <div className={styles['messages-container']}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={styles['message']}>
                <img
                  src='https://via.placeholder.com/40'
                  alt={msg.sender}
                  className={styles['sender-avatar']}
                />
                <div className={styles['message-content']}>
                  <div className={styles['sender-name']}>{msg.sender}</div>
                  <div className={styles['message-text']}>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Container */}
          <div className={styles['message-input-container']}>
            {/* Upper formatting toolbar */}
            <div className={styles['formatting-toolbar']}>
              <div className={styles['toolbar-left']}>
                <BsTypeBold className={styles['toolbar-icon']} />
                <BsTypeItalic className={styles['toolbar-icon']} />
                <BsLink45Deg className={styles['toolbar-icon']} />
                <div className={styles['divider']}></div>
                <BsListUl className={styles['toolbar-icon']} />
                <BsListOl className={styles['toolbar-icon']} />
                <div className={styles['divider']}></div>
                <BsCode className={styles['toolbar-icon']} />
              </div>
            </div>

            {/* Message input field */}
            <div className={styles['message-placeholder']}>
              <p className={styles['placeholder-text']}>
                Message Log Rocket Updates
              </p>
            </div>

            {/* Lower action toolbar */}
            <div className={styles['action-toolbar']}>
              <div className={styles['action-left']}>
                <BsPlusLg className={styles['action-icon']} />
                <BsTypeItalic className={styles['action-icon']} />
                <BsEmojiSmile className={styles['action-icon']} />
                <div className={styles['divider']}></div>
                <BsCameraVideo className={styles['action-icon']} />
                <BsMic className={styles['action-icon']} />
                <div className={styles['divider']}></div>
                <BsImage className={styles['action-icon']} />
              </div>
              <div className={styles['action-right']}>
                <RiSendPlaneFill className={styles['send-icon']} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
