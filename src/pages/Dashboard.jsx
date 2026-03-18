import { useState, useEffect, useCallback } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analyticsService } from '../services'
import { useSocket } from '../hooks'
import { ErrorMsg, EventFeed, SkeletonLoader, StatCard } from '../components/ui'
import { MAX_FEED_ITEMS } from '../config/constants'
import { CHART_TOOLTIP_STYLE, CHART_LABEL_STYLE, CHART_AXIS_TICK } from '../config/chartTheme'
import styles from './Dashboard.module.css'

const TIMESERIES_LIMIT = 40

const formatHM = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [series, setSeries] = useState([])
  const [topPages, setTopPages] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const [overview, history, pages, recent] = await Promise.all([
        analyticsService.overview(),
        analyticsService.metricsHistory(30),
        analyticsService.topPages(8),
        analyticsService.recentEvents(50),
      ])

      setMetrics(overview.data.data)
      setSeries(history.data.data.map(d => ({ ...d, time: formatHM(d.snapshot_at) })))
      setTopPages(pages.data.data)
      setEvents(recent.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleNewEvents = useCallback((batch) => {
    setEvents(prev => [...batch, ...prev].slice(0, MAX_FEED_ITEMS))
  }, [])

  const handleMetricsUpdate = useCallback((snapshot) => {
    setMetrics(snapshot)
    setSeries(prev => {
      const next = [...prev, { ...snapshot, time: formatHM(snapshot.snapshot_at || new Date()) }]
      return next.slice(-TIMESERIES_LIMIT)
    })
  }, [])

  useSocket(handleNewEvents, handleMetricsUpdate)

  if (error) return <ErrorMsg message={error} />

  return (
    <div className="fade-in">
      <div className={styles.header}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Real-Time Overview</h1>
          <p>Live application performance and traffic monitoring</p>
        </div>
        <div className={styles.uptime}>
          <span className={styles.uptimeLabel}>UPTIME</span>
          <span className={styles.uptimeValue}>99.97%</span>
        </div>
      </div>

      <div className={`grid-4 ${styles.statsRow}`}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card"><SkeletonLoader rows={3} height={20} /></div>
            ))
          : (
            <>
              <StatCard label="Active Users" value={metrics?.active_users} color="cyan" icon="◈" live sub="Currently online" />
              <StatCard label="Requests/min" value={metrics?.requests_per_min} color="green" icon="↗" live sub="Last minute" />
              <StatCard label="Avg Response" value={metrics?.avg_response_time} unit="ms" color="amber" icon="◷" live sub="P50 latency" />
              <StatCard label="Error Rate" value={metrics?.error_rate} unit="%" color="red" icon="!" live sub="Last minute" />
            </>
          )
        }
      </div>

      <div className={styles.mainRow}>
        <div className={styles.leftCol}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">
                Request Volume
                <span className={styles.titleBadge}>Live</span>
              </span>
              <span className="card-meta">Last 30 minutes</span>
            </div>
            {loading ? (
              <SkeletonLoader rows={1} height={200} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series} margin={{ top: 10, right: 4, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00d9ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    labelStyle={CHART_LABEL_STYLE}
                    itemStyle={{ color: '#00d9ff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests_per_min"
                    stroke="#00d9ff"
                    strokeWidth={2}
                    fill="url(#cyanGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Pages</span>
              <span className="card-meta">Last 24h</span>
            </div>
            {loading ? <SkeletonLoader rows={6} height={32} /> : (
              <div className="table-wrap" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th>Visits</th>
                      <th>Avg Resp</th>
                      <th>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((p, i) => (
                      <tr key={i}>
                        <td className="mono-cell">{p.path}</td>
                        <td className="green-cell">{p.visits}</td>
                        <td className="mono-cell">{p.avg_response_time}ms</td>
                        <td style={{
                          color: p.errors > 0 ? 'var(--red)' : 'var(--muted)',
                          fontFamily: 'var(--mono)',
                          fontSize: 11,
                        }}>
                          {p.errors}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="card-title">
                Event Stream
                <span className={styles.titleBadge}>Live</span>
              </span>
              <span className="card-meta">Real-time</span>
            </div>
            {loading ? <SkeletonLoader rows={10} height={42} /> : <EventFeed events={events} />}
          </div>
        </div>
      </div>
    </div>
  )
}
