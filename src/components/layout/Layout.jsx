import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className={styles.shell}>
      <nav className={styles.topnav}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.logoText}>Pulse</span>
            <span className={styles.statusBadge}>
              <span className={styles.statusDot} />
              live
            </span>
          </div>

          <div className={styles.navLinks}>
            <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Analytics
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Settings
            </NavLink>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.clock}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>{user?.name?.[0] || 'U'}</div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 2H2v12h4v-1H3V3h3V2zm4.5 3.5L14 8l-3.5 2.5V9H6V7h4.5V5.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
