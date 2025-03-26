import { useState, useRef, useEffect } from 'react'
import { BsX, BsCamera } from 'react-icons/bs'
import { FaSearch, FaTimes } from 'react-icons/fa'
import styles from './EditGroupModal.module.scss'
import httpClient from '../../../api/httpClient'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import type { Participant } from '../../../hooks/useConversations'
import { useUsers, User } from '../../../hooks/useUsers'

interface EditGroupModalProps {
  isOpen: boolean
  onClose: () => void
  conversationId: string
  initialData: {
    name: string
    description: string
    groupPicture?: string
    participants: Participant[]
  }
  onUpdate: () => void
}

type FormInputs = {
  name: string
  description: string
  participants: Participant[]
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  initialData,
  onUpdate,
}) => {
  const [groupPicture, setGroupPicture] = useState<File | null>(null)
  const [groupPicturePreview, setGroupPicturePreview] = useState<string | null>(
    initialData.groupPicture || null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Use the useUsers hook with conversation ID to exclude existing members
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(
    'group',
    conversationId
  )
  const users = usersData?.data || []

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      participants: initialData.participants,
    },
  })

  const participants = watch('participants')

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          (user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email &&
              user.email.toLowerCase().includes(searchQuery.toLowerCase()))) &&
          !participants.some((p) => p.userId === user.id)
      )
    : []

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData.name,
        description: initialData.description,
        participants: initialData.participants,
      })
      setGroupPicturePreview(initialData.groupPicture || null)
      setGroupPicture(null)
      setError(null)
    }
  }, [isOpen, initialData, reset])

  if (!isOpen) return null

  const handlePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setGroupPicture(file)
    setGroupPicturePreview(URL.createObjectURL(file))
    setError(null)
  }

  // Convert user to participant format
  const handleAddParticipant = (user: User) => {
    // Create a participant object from the user
    const newParticipant: Participant = {
      userId: user.id,
      user: {
        id: user.id,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        profilePictureUrl: user.profilePictureUrl,
        email: user.email,
      },
    }

    if (participants.some((p) => p.userId === user.id)) {
      return
    }

    setValue('participants', [...participants, newParticipant], {
      shouldValidate: true,
    })
    setSearchQuery('')
  }

  const handleRemoveParticipant = (participantId: string) => {
    setValue(
      'participants',
      participants.filter((p) => p.userId !== participantId),
      { shouldValidate: true }
    )
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')

      // Add participant IDs
      const participantIds = data.participants.map((p) => p.userId)
      formData.append('participants', JSON.stringify(participantIds))

      // Add group picture if changed
      if (groupPicture) {
        formData.append('groupPicture', groupPicture)
      }

      // Make the API call
      const response = await httpClient.patch(
        `/conversation/${conversationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Check if API call was successful
      if (response.status >= 200 && response.status < 300) {
        // Call onUpdate to refresh data
        if (onUpdate) {
          onUpdate()
        }
        onClose()
      } else {
        throw new Error('Failed to update group')
      }
    } catch (err: any) {
      console.error('Error updating group:', err)
      setError(err?.response?.data?.message || 'Failed to update group')
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Edit Group</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <BsX size={24} />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <div className={styles.groupPictureContainer}>
              <div
                className={styles.groupPicture}
                onClick={() => fileInputRef.current?.click()}
              >
                {groupPicturePreview ? (
                  <img src={groupPicturePreview} alt='Group' />
                ) : (
                  <div className={styles.pictureUploadPlaceholder}>
                    <BsCamera size={32} />
                    <span>Add Group Picture</span>
                  </div>
                )}
                <div className={styles.pictureOverlay}>
                  <BsCamera size={20} />
                </div>
              </div>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handlePictureSelect}
                accept='image/*'
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='name'>Group Name</label>
            <input
              id='name'
              type='text'
              className={`${styles.inputField} ${
                errors.name ? styles.inputError : ''
              }`}
              placeholder='Enter group name'
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

          <div className={styles.formGroup}>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              className={styles.inputField}
              placeholder='Describe this group'
              rows={3}
              {...register('description')}
            ></textarea>
          </div>

          <Controller
            name='participants'
            control={control}
            rules={{
              validate: (value) =>
                value.length > 0 || 'At least one participant is required',
            }}
            render={({ field }) => (
              <div className={styles.participantsSection}>
                <label className={styles.inputLabel}>Participants</label>

                {/* Search Input */}
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
                {field.value.length > 0 && (
                  <div className={styles.selectedParticipants}>
                    {field.value.map((user) => (
                      <div key={user.userId} className={styles.selectedUser}>
                        <img
                          src={
                            user.user?.profilePictureUrl ||
                            user.user?.profilePicture ||
                            'https://via.placeholder.com/30'
                          }
                          alt={user.user?.displayName}
                          className={styles.userAvatar}
                        />
                        <span>{user.user?.displayName} </span>
                        <button
                          type='button'
                          className={styles.removeUserButton}
                          onClick={() => handleRemoveParticipant(user.userId)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search results */}
                {searchQuery && (
                  <div className={styles.userDropdown}>
                    {isLoadingUsers ? (
                      <div className={styles.loadingUsers}>
                        Loading users...
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={styles.userItem}
                          onClick={() => handleAddParticipant(user)}
                        >
                          <img
                            src={
                              user.profilePictureUrl ||
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

                {errors.participants && (
                  <p className={styles.errorMessage}>
                    {errors.participants.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className={styles.formActions}>
            <button
              type='button'
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGroupModal
