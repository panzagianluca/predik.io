'use client'

import { useAuth } from '../../../lib/auth/AuthProvider'
import { tradingService } from '../../../lib/supabase/trading'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const { user, loading } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [markets, setMarkets] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadUserData()
      loadMarkets()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return
    
    const profile = await tradingService.getUserProfile(user.id)
    setUserProfile(profile)
    
    const userPositions = await tradingService.getUserPositions(user.id)
    setPositions(userPositions)
  }

  const loadMarkets = async () => {
    const activeMarkets = await tradingService.getActiveMarkets()
    setMarkets(activeMarkets)
  }

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testTrade = async (marketId: string, tradeType: 'buy_yes' | 'buy_no', amount: number) => {
    if (!user) return
    
    addTestResult(`Testing ${tradeType} trade for $${amount}...`)
    const result = await tradingService.executeBinaryTrade(marketId, user.id, tradeType, amount)
    
    if (result.success) {
      addTestResult(`✅ Trade successful! Got ${result.shares_bought} shares at $${result.price_per_share}`)
      await loadUserData() // Refresh data
    } else {
      addTestResult(`❌ Trade failed: ${result.error}`)
    }
  }

  const createProfileManually = async () => {
    if (!user) return
    
    addTestResult('Creating user profile manually...')
    
    try {
      const baseUsername = (user.user_metadata?.full_name || user.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
      
      const { data, error } = await tradingService.createUserProfile(
        user.id,
        user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User',
        baseUsername,
        user.user_metadata?.avatar_url || null
      )

      if (error) {
        addTestResult(`❌ Manual profile creation failed: ${error.message}`)
        addTestResult(`Error details: ${JSON.stringify(error)}`)
      } else if (data?.success) {
        addTestResult(`✅ Profile created manually: ${data.username} with $${data.starting_balance}`)
        await loadUserData() // Refresh data
      } else {
        addTestResult(`❌ Profile creation failed: ${data?.error || 'Unknown error'}`)
        addTestResult(`Full response: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      addTestResult(`❌ Error creating profile: ${error}`)
    }
  }

  const checkUserAuth = () => {
    addTestResult(`User ID: ${user?.id}`)
    addTestResult(`User Email: ${user?.email}`)
    addTestResult(`User Metadata: ${JSON.stringify(user?.user_metadata)}`)
  }

  const checkDatabaseDirectly = async () => {
    if (!user) return
    
    addTestResult('🔍 Checking users_profile table directly...')
    
    try {
      // Direct query to check if user exists in users_profile
      const { data, error } = await tradingService.checkUserInDatabase(user.id)
      
      if (error) {
        addTestResult(`❌ Database check error: ${error.message}`)
      } else if (data) {
        addTestResult(`✅ User found in database: ${JSON.stringify(data)}`)
      } else {
        addTestResult(`❌ User NOT found in users_profile table`)
      }
    } catch (error) {
      addTestResult(`❌ Error checking database: ${error}`)
    }
  }

  const testAuthFlow = async () => {
    if (!user) {
      addTestResult('❌ No user logged in')
      return
    }
    
    addTestResult('🔄 Testing complete auth flow...')
    addTestResult(`User ID: ${user.id}`)
    addTestResult(`Email: ${user.email}`)
    
    // Check if profile exists
    const { data, error } = await tradingService.checkUserInDatabase(user.id)
    
    if (error) {
      addTestResult(`❌ Profile check failed: ${error.message}`)
    } else if (data) {
      addTestResult(`✅ Profile exists: ${data.username} with $${data.balance}`)
    } else {
      addTestResult(`❌ No profile found - automatic creation failed`)
      addTestResult(`ℹ️ You can click "Create Profile" to fix this`)
    }
  }

  const testBasicTrade = async () => {
    if (!user || !markets.length) {
      addTestResult('❌ Need user and markets to test trading')
      return
    }
    
    const market = markets[0]
    addTestResult(`🎯 Testing small YES trade on: ${market.title}`)
    
    await testTrade(market.id, 'buy_yes', 50) // Small $50 test
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>
        <p>Please log in to test database functions.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 Database Function Testing</h1>
      
      {/* User Profile Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold mb-4">👤 Your Profile</h2>
        {userProfile ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-bold">{userProfile.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-bold text-green-600">${userProfile.balance?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="font-bold">${userProfile.total_volume?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="font-bold">{userProfile.win_rate}%</p>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      {/* Test Actions Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold mb-4">🎮 Debug Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={checkUserAuth}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Check Auth Info
          </button>
          
          <button
            onClick={checkDatabaseDirectly}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Check Database
          </button>
          
          <button
            onClick={createProfileManually}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Profile
          </button>
          
          <button
            onClick={testAuthFlow}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Test Auth Flow
          </button>
          
          <button
            onClick={() => loadUserData()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Refresh Data
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Markets Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold mb-4">📊 Active Markets</h2>
        {markets.length > 0 ? (
          <div className="space-y-4">
            {markets.map((market) => (
              <div key={market.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{market.title}</h3>
                <p className="text-gray-600 mb-4">{market.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Yes Price</p>
                    <p className="font-bold text-green-600">{(market.yes_price * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No Price</p>
                    <p className="font-bold text-red-600">{(market.no_price * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="font-bold">${market.total_volume?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-bold">{market.participant_count}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => testTrade(market.id, 'buy_yes', 100)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Buy YES ($100)
                  </button>
                  <button
                    onClick={() => testTrade(market.id, 'buy_no', 100)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Buy NO ($100)
                  </button>
                  <button
                    onClick={() => testTrade(market.id, 'buy_yes', 500)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Buy YES ($500)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No active markets found. Create a test market first!</p>
        )}
      </div>

      {/* User Positions */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow">
        <h2 className="text-xl font-bold mb-4">💼 Your Positions</h2>
        {positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((position) => (
              <div key={position.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{position.markets?.title}</p>
                  <p className="text-sm text-gray-600">
                    {position.shares_owned?.toFixed(2)} {position.position_type.toUpperCase()} shares
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${position.current_value?.toFixed(2)}</p>
                  <p className={`text-sm ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {position.unrealized_pnl >= 0 ? '+' : ''}${position.unrealized_pnl?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No positions yet. Make some trades to see your positions here!</p>
        )}
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-4">📝 Test Results</h2>
        <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto">
          {testResults.length > 0 ? (
            testResults.map((result, index) => (
              <p key={index} className="text-sm font-mono mb-1">
                {result}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No test results yet. Try some actions above!</p>
          )}
        </div>
      </div>
    </div>
  )
}
