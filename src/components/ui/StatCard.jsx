import styles from './ui.module.css'

const COLOR_MAP = {
  cyan:   { fg: 'var(--accent)', bg: 'var(--accent-dim)',  glow: 'rgba(0,217,255,0.25)' },
  green:  { fg: 'var(--green)',  bg: 'var(--green-dim)',   glow: 'rgba(0,255,163,0.25)' },
  blue:   { fg: 'var(--blue)',   bg: 'var(--blue-dim)',    glow: 'rgba(74,158,255,0.25)' },
  amber:  { fg: 'var(--amber)',  bg: 'var(--amber-dim)',   glow: 'rgba(255,181,71,0.25)' },
  red:    { fg: 'var(--red)',    bg: 'var(--red-dim)',     glow: 'rgba(255,84,112,0.25)' },
  purple: { fg: 'var(--purple)', bg: 'var(--purple-dim)',  glow: 'rgba(199,125,255,0.25)' },
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.unit]
 * @param {string} [props.sub]
 * @param {'cyan'|'green'|'blue'|'amber'|'red'|'purple'} [props.color]
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.live]
 */
export function StatCard({ label, value, unit = '', sub, color = 'cyan', icon, live = false }) {
  const c = COLOR_MAP[color] || COLOR_MAP.cyan

  return (
    <div className={styles.statCard} style={{ '--card-glow': c.glow, '--card-fg': c.fg, '--card-bg': c.bg }}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>
          {label}
          {live && <span className={styles.liveDot} />}
        </span>
        <div className={styles.statIcon}>{icon}</div>
      </div>
      <div className={styles.statValue}>
        {value ?? '—'}
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </div>
      {sub && <div className={styles.statSub}>{sub}</div>}
      <div className={styles.statBg} />
    </div>
  )
}
