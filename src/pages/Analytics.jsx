import { useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { analyticsService } from '../services'
import { useApi } from '../hooks'
import { ErrorMsg, SkeletonLoader } from '../components/ui'
import { TIME_RANGES } from '../config/constants'
import {
  CHART_AXIS_TICK, CHART_COLORS, CHART_GRID_STROKE, CHART_TOOLTIP_STYLE,
} from '../config/chartTheme'
import styles from './Analytics.module.css'

const formatHM = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function Analytics() {
  const [range, setRange] = useState(TIME_RANGES[2])

  const ts = useApi(() => analyticsService.timeSeries(range.hours), [range.hours])
  const pie = useApi(() => analyticsService.trafficByPage(range.hours), [range.hours])

  const tsData = (ts.data || []).map(d => ({
    hour: formatHM(d.hour),
    requests: parseInt(d.requests),
    errors: parseInt(d.errors),
  }))

  const pieData = (pie.data || []).map(d => ({
    name: d.path,
    value: parseInt(d.visits),
  }))

  const totalVisits = pieData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="fade-in">
      <div className={styles.header}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Analytics</h1>
          <p>Historical traffic analysis and breakdowns</p>
        </div>

        <div className={styles.timeFilters}>
          {TIME_RANGES.map(r => (
            <button
              key={r.label}
              className={`btn-ghost ${range.label === r.label ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {ts.error && <ErrorMsg message={ts.error} />}

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Requests by Hour</span>
            <span className="card-meta">{range.label}</span>
          </div>
          {ts.loading ? <SkeletonLoader rows={1} height={220} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tsData} margin={{ top: 10, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="hour" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="requests" fill="#00d9ff" radius={[3, 3, 0, 0]} />
                <Bar dataKey="errors" fill="#ff5470" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Traffic Distribution</span>
            <span className="card-meta">{range.label}</span>
          </div>
          {pie.loading ? <SkeletonLoader rows={1} height={220} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 10.5, fontFamily: 'JetBrains Mono', color: '#9ca3b3' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Page Breakdown</span>
          <span className="card-meta">Last {range.label}</span>
        </div>
        {pie.loading ? <SkeletonLoader rows={8} height={36} /> : (
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Visits</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {pieData.map((p, i) => {
                  const pct = totalVisits > 0 ? ((p.value / totalVisits) * 100).toFixed(1) : 0
                  const color = CHART_COLORS[i % CHART_COLORS.length]
                  return (
                    <tr key={i}>
                      <td className="mono-cell">{p.name}</td>
                      <td className="green-cell">{p.value}</td>
                      <td>
                        <div className={styles.barWrap}>
                          <div
                            className={styles.barFill}
                            style={{
                              width: `${pct}%`,
                              background: color,
                              boxShadow: `0 0 8px ${color}80`,
                            }}
                          />
                          <span className="mono-cell">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
