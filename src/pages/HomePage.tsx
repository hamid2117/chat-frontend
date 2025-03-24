// ChatInterface.jsx
import React, { useState } from 'react'
import {
  BsSearch,
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
  BsPaperclip,
  BsMic,
  BsCameraVideo,
  BsImage,
  BsChevronDown,
  BsPerson,
} from 'react-icons/bs'
import { RiSendPlaneFill } from 'react-icons/ri'

const Hero = () => {
  const [message, setMessage] = useState('')

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
    <div className='chat-container'>
      {/* Top Navbar - Full Width */}
      <div className='top-navbar'>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search QLU Recruiting'
            className='search-input'
          />
        </div>
      </div>

      <div className='main-content'>
        {/* Left Sidebar Navigation */}
        <div className='left-sidebar'>
          <div className='logo-container'>
            <img
              src='https://via.placeholder.com/40'
              alt='Logo'
              className='user-avatar'
            />
          </div>
          <div className='nav-icons'>
            <div className='nav-icon-wrapper active'>
              <BsHouseDoor className='nav-icon' />
            </div>
            <div className='nav-icon-wrapper'>
              <BsBell className='nav-icon' />
            </div>
            <div className='nav-icon-wrapper'>
              <BsChatDots className='nav-icon' />
            </div>
            <div className='nav-icon-wrapper'>
              <BsThreeDotsVertical className='nav-icon' />
              <span className='nav-text'>More</span>
            </div>
          </div>
          <div className='sidebar-bottom'>
            <BsPlusLg className='nav-icon' />
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className='user-avatar'
            />
          </div>
        </div>

        {/* Chat List Section */}
        <div className='chat-list'>
          {/* Header */}
          <div className='chat-list-header'>
            <h2>QLU Recruiting</h2>
          </div>

          {/* Main Navigation */}
          <div className='main-menu'>
            <div className='menu-item'>
              <BsPerson className='menu-icon' />
              <p>Groups</p>
            </div>
            <div className='menu-item'>
              <BsChatDots className='menu-icon' />
              <p>Direct Messages</p>
            </div>
          </div>

          {/* Groups section */}
          <div className='group-section'>
            <div className='section-header'>
              <BsChevronDown className='dropdown-icon' />
              <p>Groups</p>
            </div>
            <div className='group-list'>
              {groupChats.map((group) => (
                <div
                  key={group.id}
                  className={`group-item ${group.active ? 'active' : ''}`}
                >
                  <img
                    src='https://via.placeholder.com/30'
                    alt='Group'
                    className='group-avatar'
                  />
                  <p>{group.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages section */}
          <div className='group-section'>
            <div className='section-header'>
              <BsChevronDown className='dropdown-icon' />
              <p>Direct Messages</p>
            </div>
            <div className='group-list'>
              {directMessages.map((dm) => (
                <div key={dm.id} className='group-item'>
                  <img
                    src='https://via.placeholder.com/30'
                    alt='User'
                    className='group-avatar'
                  />
                  <p>{dm.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Content Area */}
        <div className='chat-content'>
          {/* Chat Top Navbar */}
          {/* <div className="chat-navbar">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search QLU Recruiting"
                className="search-input"
              />
            </div>
          </div> */}

          {/* Chat Header */}
          <div className='chat-header'>
            <div className='chat-title'>
              <span>Log Rocket Group</span>
              <span className='arrow'>▶</span>
            </div>
            <div className='chat-controls'>
              <div className='user-avatars'>
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className='user-avatar'
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className='user-avatar'
                />
                <img
                  src='https://via.placeholder.com/30'
                  alt='User'
                  className='user-avatar'
                />
              </div>
              <BsMic className='control-icon' />
              <BsCameraVideo className='control-icon' />
            </div>
          </div>

          {/* Messages Container */}
          <div className='messages-container'>
            {chatMessages.map((msg) => (
              <div key={msg.id} className='message'>
                <img
                  src='https://via.placeholder.com/40'
                  alt={msg.sender}
                  className='sender-avatar'
                />
                <div className='message-content'>
                  <div className='sender-name'>{msg.sender}</div>
                  <div className='message-text'>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Container */}
          <div className='message-input-container'>
            {/* Upper formatting toolbar */}
            <div className='formatting-toolbar'>
              <div className='toolbar-left'>
                <BsTypeBold className='toolbar-icon' />
                <BsTypeItalic className='toolbar-icon' />
                <BsLink45Deg className='toolbar-icon' />
                <div className='divider'></div>
                <BsListUl className='toolbar-icon' />
                <BsListOl className='toolbar-icon' />
                <div className='divider'></div>
                <BsCode className='toolbar-icon' />
              </div>
            </div>

            {/* Message input field */}
            <div className='message-placeholder'>
              <p className='placeholder-text'>Message Log Rocket Updates</p>
            </div>

            {/* Lower action toolbar */}
            <div className='action-toolbar'>
              <div className='action-left'>
                <BsPlusLg className='action-icon' />
                <BsTypeItalic className='action-icon' />
                <BsEmojiSmile className='action-icon' />
                <div className='divider'></div>
                <BsCameraVideo className='action-icon' />
                <BsMic className='action-icon' />
                <div className='divider'></div>
                <BsImage className='action-icon' />
              </div>
              <div className='action-right'>
                <RiSendPlaneFill className='send-icon' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
