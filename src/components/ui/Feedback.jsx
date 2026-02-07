import styles from './ui.module.css'

export function SkeletonLoader({ rows = 5, height = 40 }) {
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={styles.skeletonRow}
          style={{ height, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  )
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

export function Spinner({ size = 24 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div
        style={{
          width: size,
          height: size,
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  )
}

export function ErrorMsg({ message }) {
  return <div className="error-msg">{message}</div>
}
