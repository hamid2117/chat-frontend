import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './style.module.scss'
import { FaTimes, FaSearch } from 'react-icons/fa'
import { useCreateGroupConversation } from '../../../../hooks/useConversations'
import { useUsers, User } from '../../../../hooks/useUsers'
import { toast } from 'react-toastify'

interface CreateGroupConversationModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormInputs = {
  name: string
}

const CreateGroupConversationModal: React.FC<
  CreateGroupConversationModalProps
> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
    },
  })

  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const { data: usersData, isLoading: isLoadingUsers } = useUsers('group')
  const users = usersData?.data || []

  const filteredUsers = users.filter(
    (user) =>
      (user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      !selectedParticipants.some((selected) => selected.id === user.id)
  )

  const { mutate: createGroupConversation, isPending } =
    useCreateGroupConversation()

  const handleSelectUser = (user: User) => {
    setSelectedParticipants([...selectedParticipants, user])
    setSearchQuery('')
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== userId))
  }

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (selectedParticipants.length === 0) {
      toast.error('At least one participant is required')
      return
    }

    const formattedData = {
      name: data.name,
      participants: selectedParticipants.map((p) => p.id),
    }

    createGroupConversation(formattedData, {
      onSuccess: () => {
        reset()
        setSelectedParticipants([])
        setSearchQuery('')
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Create Group Chat</h2>
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
            <div className={styles.inputGroup}>
              <label htmlFor='name' className={styles.inputLabel}>
                Group Name
              </label>
              <input
                id='name'
                type='text'
                placeholder='Enter group name'
                className={`${styles.inputField} ${
                  errors.name ? styles.inputError : ''
                }`}
                {...register('name', {
                  required: 'Group name is required',
                  minLength: {
                    value: 3,
                    message: 'Group name must be at least 3 characters',
                  },
                })}
              />
              {errors.name && (
                <p className={styles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.participantsSection}>
              <label className={styles.inputLabel}>Participants</label>

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

              {/* Selected participants */}
              {selectedParticipants.length > 0 && (
                <div className={styles.selectedParticipants}>
                  {selectedParticipants.map((user) => (
                    <div key={user.id} className={styles.selectedUser}>
                      <img
                        src={
                          user.profilePicture || 'https://placehold.co/30x30'
                        }
                        alt={user.displayName}
                        className={styles.userAvatar}
                      />
                      <span>{user.displayName}</span>
                      <button
                        type='button'
                        className={styles.removeUserButton}
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* User search results */}
              {searchQuery && (
                <div className={styles.userDropdown}>
                  {isLoadingUsers ? (
                    <div className={styles.loadingUsers}>Loading users...</div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className={styles.userItem}
                        onClick={() => handleSelectUser(user)}
                      >
                        <img
                          src={
                            user.profilePicture || 'https://placehold.co/30x30'
                          }
                          alt={user.displayName}
                          className={styles.userAvatar}
                        />
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>
                            {user.displayName}
                          </div>
                          {user.email && (
                            <div className={styles.userEmail}>{user.email}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noUsers}>No users found</div>
                  )}
                </div>
              )}

              {selectedParticipants.length === 0 && !searchQuery && (
                <p className={styles.helperText}>
                  Search and select users to add to this group
                </p>
              )}
            </div>

            <button
              type='submit'
              className={styles.submitButton}
              disabled={
                isPending || isSubmitting || selectedParticipants.length === 0
              }
            >
              {isPending ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupConversationModal
