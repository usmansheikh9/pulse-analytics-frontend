import { useEffect, useRef } from 'react'
import styles from './ui.module.css'

const TYPE_COLORS = {
  pageview: 'var(--blue)',
  api_call: 'var(--green)',
  error: 'var(--red)',
}

const formatTime = (ms) =>
  new Date(ms).toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

// TODO: add infinite scroll for events feed

/**
 * Live-updating event stream.
 * @param {object} props
 * @param {Array} props.events
 */
export function EventFeed({ events = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0
  }, [events.length])

  if (events.length === 0) {
    return (
      <div className={styles.feed}>
        <div className={styles.feedEmpty}>Listening for events...</div>
      </div>
    )
  }

  return (
    <div className={styles.feed} ref={ref}>
      {events.map((e, i) => {
        const color = TYPE_COLORS[e.type]
        const isErr = e.status_code >= 400
        return (
          <div key={e.id || i} className={styles.feedItem}>
            <div
              className={styles.feedDot}
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <div className={styles.feedContent}>
              <div className={styles.feedPath}>{e.path}</div>
              <div className={styles.feedMeta}>
                <span className={`badge badge-${e.type}`}>{e.type}</span>
                <span
                  className={styles.feedStatus}
                  style={{ color: isErr ? 'var(--red)' : 'var(--muted2)' }}
                >
                  {e.status_code}
                </span>
                <span className={styles.feedTime}>{e.response_time_ms}ms</span>
              </div>
            </div>
            <div className={styles.feedTs}>{formatTime(e.created_at)}</div>
          </div>
        )
      })}
    </div>
  )
}
