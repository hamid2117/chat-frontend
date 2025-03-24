import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <div className={styles.topNavbar}>
      <div className={styles.searchContainer}>
        <input
          type='text'
          placeholder='Search QLU Recruiting'
          className={styles.searchInput}
        />
      </div>
    </div>
  )
}

export default Navbar
