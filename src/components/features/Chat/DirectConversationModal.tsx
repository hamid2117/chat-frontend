import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './ConversationModal.module.scss'
import { FaTimes, FaSearch } from 'react-icons/fa'
import { useCreateDirectConversation } from '../../../hooks/useConversations'
import { useUsers, User } from '../../../hooks/useUsers'
import { toast } from 'react-toastify'

interface CreateDirectConversationModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormInputs = {
  userId: string
}

const CreateDirectConversationModal: React.FC<
  CreateDirectConversationModalProps
> = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { data: usersData, isLoading: isLoadingUsers } = useUsers('direct')
  const users = usersData?.data || []

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const { mutate: createDirectConversation, isPending } =
    useCreateDirectConversation()

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSearchQuery('')
  }

  const handleRemoveUser = () => {
    setSelectedUser(null)
  }

  const onSubmit: SubmitHandler<FormInputs> = () => {
    if (!selectedUser) {
      toast.error('Please select a user to start a conversation with')
      return
    }

    createDirectConversation(
      { userId: selectedUser.id },
      {
        onSuccess: () => {
          reset()
          setSelectedUser(null)
          setSearchQuery('')
          onClose()
        },
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>New Direct Message</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close modal'
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.participantsSection}>
              <label className={styles.inputLabel}>Select a User</label>

              {/* Selected user */}
              {selectedUser ? (
                <div className={styles.selectedParticipants}>
                  <div className={styles.selectedUser}>
                    <img
                      src={
                        selectedUser.profilePicture ||
                        'https://via.placeholder.com/30'
                      }
                      alt={selectedUser.displayName}
                      className={styles.userAvatar}
                    />
                    <span>{selectedUser.displayName}</span>
                    <button
                      type='button'
                      className={styles.removeUserButton}
                      onClick={handleRemoveUser}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* User search */}
                  <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type='text'
                      placeholder='Search users...'
                      className={styles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* User search results */}
                  {searchQuery && (
                    <div className={styles.userDropdown}>
                      {isLoadingUsers ? (
                        <div className={styles.loadingUsers}>
                          Loading users...
                        </div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.slice(0, 5).map((user) => (
                          <div
                            key={user.id}
                            className={styles.userItem}
                            onClick={() => handleSelectUser(user)}
                          >
                            <img
                              src={
                                user.profilePicture ||
                                'https://via.placeholder.com/30'
                              }
                              alt={user.displayName}
                              className={styles.userAvatar}
                            />
                            <div className={styles.userInfo}>
                              <div className={styles.userName}>
                                {user.displayName}
                              </div>
                              {user.email && (
                                <div className={styles.userEmail}>
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noUsers}>No users found</div>
                      )}
                    </div>
                  )}
                </>
              )}

              {!selectedUser && !searchQuery && (
                <p className={styles.helperText}>
                  Search and select a user to start a conversation
                </p>
              )}
            </div>

            <button
              type='submit'
              className={styles.submitButton}
              disabled={isPending || isSubmitting || !selectedUser}
            >
              {isPending ? 'Creating...' : 'Create Cnversation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDirectConversationModal
