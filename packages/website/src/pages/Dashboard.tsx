import { useState, useEffect } from 'react'

interface Stats {
  totalPayments: number
  totalVolume: string
  avgPaymentSize: string
  treasuryBalance: string
  merchantCount: number
  last24h: {
    payments: number
    volume: string
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await fetch(`${apiUrl}/stats`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        
        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error loading statistics</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <p className="text-gray-600 text-sm mt-4">
            Make sure the API server is running and the /stats endpoint is available.
          </p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Payments',
      value: stats?.totalPayments.toLocaleString() || '0',
      subtitle: 'All-time transactions',
      icon: '💳',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Total Volume',
      value: stats?.totalVolume || '0',
      subtitle: 'wXNT processed',
      icon: '💰',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Average Payment',
      value: stats?.avgPaymentSize || '0',
      subtitle: 'wXNT per transaction',
      icon: '📊',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Active Merchants',
      value: stats?.merchantCount.toLocaleString() || '0',
      subtitle: 'Using X1Pays',
      icon: '🏪',
      color: 'bg-indigo-50 border-indigo-200'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Protocol Dashboard</h1>
        <p className="text-xl text-gray-600">
          Real-time statistics and metrics for the X1Pays payment protocol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} border rounded-lg p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-sm font-medium text-gray-700 mb-1">{card.title}</div>
            <div className="text-xs text-gray-500">{card.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Last 24 Hours</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Payments Processed</span>
              <span className="text-2xl font-bold text-indigo-600">
                {stats?.last24h.payments.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Volume</span>
              <span className="text-2xl font-bold text-green-600">
                {stats?.last24h.volume || '0'} wXNT
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Network Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Active Merchants</span>
              <span className="text-2xl font-bold text-purple-600">
                {stats?.merchantCount || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Protocol Fee</span>
              <span className="text-2xl font-bold text-green-600">0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-3">Want to become a merchant?</h3>
        <p className="mb-6 text-indigo-100">
          Integrate x402 payments into your API and start earning wXNT tokens today.
          Setup takes less than 10 minutes with our simple SDK.
        </p>
        <a
          href="/docs/getting-started"
          className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
        >
          Get Started Now →
        </a>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Statistics update every 30 seconds • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

export default Dashboard
