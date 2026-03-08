import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services"
import styles from "./Settings.module.css"

const MIN_PASSWORD_LENGTH = 8

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handlePasswordChange(e) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setMessage({ type: "error", text: `Minimum ${MIN_PASSWORD_LENGTH} characters` })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      await authService.changePassword(currentPassword, newPassword)
      setMessage({ type: "success", text: "Password updated successfully" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      })
    } finally {
      setSubmitting(false)
    }
  }

  function handleSignOut() {
    logout()
    navigate("/login")
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <div className={styles.grid}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Profile</span>
          </div>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>{user?.name?.[0]}</div>
            <div>
              <div className={styles.profileName}>{user?.name}</div>
              <div className={styles.profileEmail}>{user?.email}</div>
              <div className={styles.profileRole}>{user?.role}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Change Password</span>
          </div>

          {message && (
            <div className={message.type === "error" ? "error-msg" : "success-msg"}>
              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="field">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Session</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
            Signing out will clear your session token from this browser.
          </p>
          <button
            className="btn-ghost"
            onClick={handleSignOut}
            style={{ borderColor: "var(--red)", color: "var(--red)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
