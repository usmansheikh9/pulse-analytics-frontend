import { useEffect, useState } from 'react'
import api from '../services/api'
import { ENDPOINTS } from '../config/endpoints'
import { StatCard, SkeletonLoader } from '../components/ui'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(ENDPOINTS.OVERVIEW)
      .then(r => setMetrics(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>Real-Time Overview</h1>
        <p>Live application performance and traffic monitoring</p>
      </div>
      <div className="grid-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card"><SkeletonLoader rows={3} height={20} /></div>
        )) : (
          <>
            <StatCard label="Active Users" value={metrics?.active_users} color="cyan" icon="◈" />
            <StatCard label="Requests/min" value={metrics?.requests_per_min} color="green" icon="↗" />
            <StatCard label="Avg Response" value={metrics?.avg_response_time} unit="ms" color="amber" icon="◷" />
            <StatCard label="Error Rate" value={metrics?.error_rate} unit="%" color="red" icon="!" />
          </>
        )}
      </div>
    </div>
  )
}
