import { useRef, useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import QuarterSelector from './components/QuarterSelector'
import { quarterAPI } from './services/api'

function App() {
  const saveFunctionRef = useRef(null)
  const [currentQuarterId, setCurrentQuarterId] = useState(null)
  const [viewMode, setViewMode] = useState('LIVE') // 'LIVE' or 'BASELINE'
  const [loading, setLoading] = useState(true)
  const [quarterBaselines, setQuarterBaselines] = useState({}) // Map of quarterId -> hasBaseline

  // Load active quarter on mount
  useEffect(() => {
    loadActiveQuarter()
  }, [])

  const loadActiveQuarter = async () => {
    try {
      const activeQuarter = await quarterAPI.getActive()
      setCurrentQuarterId(activeQuarter.id)
    } catch (error) {
      console.log('No active quarter found')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (saveFunctionRef.current && saveFunctionRef.current.save) {
      return saveFunctionRef.current.save()
    }
    return false
  }

  const handleSetBaseline = () => {
    if (saveFunctionRef.current && saveFunctionRef.current.setBaseline) {
      saveFunctionRef.current.setBaseline()
    }
  }

  const handleQuarterChange = (quarterId) => {
    setCurrentQuarterId(quarterId)
    // Reset to LIVE mode when changing quarters
    setViewMode('LIVE')
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  // Load baseline status for all quarters
  const loadQuarterBaselines = async () => {
    try {
      const quarters = await quarterAPI.getAll()
      const baselineMap = {}
      for (const quarter of quarters) {
        const fullQuarter = await quarterAPI.getById(quarter.id)
        baselineMap[quarter.id] = !!fullQuarter.baseline_data
      }
      setQuarterBaselines(baselineMap)
    } catch (error) {
      console.error('Error loading quarter baselines:', error)
    }
  }

  useEffect(() => {
    if (!loading) {
      loadQuarterBaselines()
    }
  }, [loading])


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
        <QuarterSelector
          currentQuarterId={currentQuarterId}
          onQuarterChange={handleQuarterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          quarterBaselines={quarterBaselines}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onSave={handleSave} 
          viewMode={viewMode}
          onSetBaseline={handleSetBaseline}
          hasBaseline={quarterBaselines[currentQuarterId] || false}
        />
        <main className="flex-1 overflow-y-auto">
          {currentQuarterId ? (
            <Dashboard 
              saveFunctionRef={saveFunctionRef} 
              quarterId={currentQuarterId}
              viewMode={viewMode}
              onBaselineUpdated={loadQuarterBaselines}
            />
          ) : (
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600 mb-4">No active quarter selected.</p>
                <p className="text-sm text-gray-500">
                  Create a new quarter to get started.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

