import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export function useSocket(onEvent, onMetrics) {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('pulse_token')
    const socket = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token },
      transports: ['websocket', 'polling'],
    })
    socket.on('new_events', (events) => onEvent && onEvent(events))
    socket.on('metrics_update', (metrics) => onMetrics && onMetrics(metrics))
    socketRef.current = socket
    return () => socket.disconnect()
  }, [])

  return socketRef.current
}
