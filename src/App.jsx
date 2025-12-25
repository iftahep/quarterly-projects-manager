import { useRef, useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import QuarterSelector from './components/QuarterSelector'
import { quarterAPI } from './services/api'

function App() {
  const saveFunctionRef = useRef(null)
  const [currentQuarterId, setCurrentQuarterId] = useState(null)
  const [loading, setLoading] = useState(true)

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
    if (saveFunctionRef.current) {
      return saveFunctionRef.current()
    }
    return false
  }

  const handleQuarterChange = (quarterId) => {
    setCurrentQuarterId(quarterId)
  }


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
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSave={handleSave} />
        <main className="flex-1 overflow-y-auto">
          {currentQuarterId ? (
            <Dashboard 
              saveFunctionRef={saveFunctionRef} 
              quarterId={currentQuarterId}
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

