import { useState, useEffect } from 'react'
import { quarterAPI } from '../services/api'

function QuarterSelector({ currentQuarterId, onQuarterChange, viewMode, onViewModeChange, quarterBaselines }) {
  const [quarters, setQuarters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newQuarterName, setNewQuarterName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(null) // quarter to delete
  const [expandedQuarters, setExpandedQuarters] = useState(new Set()) // Track which quarters are expanded

  useEffect(() => {
    loadQuarters()
  }, [])

  // Auto-expand current quarter
  useEffect(() => {
    if (currentQuarterId) {
      setExpandedQuarters(prev => new Set([...prev, currentQuarterId]))
    }
  }, [currentQuarterId])

  const loadQuarters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await quarterAPI.getAll()
      setQuarters(data)
    } catch (err) {
      setError('Failed to load quarters')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuarter = async () => {
    if (!newQuarterName.trim()) {
      alert('Please enter a quarter name')
      return
    }

    try {
      // Create with empty data
      const newQuarter = await quarterAPI.create(newQuarterName.trim(), {
        projects: [],
        backendSprints: [],
        androidSprints: [],
        iosSprints: []
      })

      // Activate it
      await quarterAPI.activate(newQuarter.id)
      
      setShowCreateModal(false)
      setNewQuarterName('')
      await loadQuarters()
      onQuarterChange(newQuarter.id)
    } catch (err) {
      alert('Failed to create quarter: ' + err.message)
    }
  }

  const handleActivateQuarter = async (id) => {
    try {
      await quarterAPI.activate(id)
      await loadQuarters()
      onQuarterChange(id)
    } catch (err) {
      alert('Failed to activate quarter: ' + err.message)
    }
  }

  const handleDeleteQuarter = async () => {
    if (!showDeleteModal) return

    try {
      const quarterId = showDeleteModal.id
      const wasActive = showDeleteModal.isActive
      
      await quarterAPI.delete(quarterId)
      
      // If deleted quarter was active, try to activate another one
      if (wasActive) {
        const remainingQuarters = quarters.filter(q => q.id !== quarterId)
        if (remainingQuarters.length > 0) {
          await quarterAPI.activate(remainingQuarters[0].id)
          onQuarterChange(remainingQuarters[0].id)
        } else {
          onQuarterChange(null)
        }
      } else if (currentQuarterId === quarterId) {
        // If we deleted the current quarter (but it wasn't active), clear selection
        onQuarterChange(null)
      }
      
      setShowDeleteModal(null)
      await loadQuarters()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete quarter: ' + (err.message || 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-600 text-sm">Loading quarters...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Quarters</h3>
      </div>

      {/* Quarters List */}
      <div className="flex-1 overflow-y-auto p-2">

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-1">
          {quarters.length === 0 ? (
            <p className="text-gray-500 text-xs p-2">No quarters yet. Create one to get started!</p>
          ) : (
            quarters.map((quarter) => {
              const isExpanded = expandedQuarters.has(quarter.id)
              const hasBaseline = quarterBaselines && quarterBaselines[quarter.id]
              const isCurrentQuarter = currentQuarterId === quarter.id
              const isLiveSelected = isCurrentQuarter && viewMode === 'LIVE'
              const isBaselineSelected = isCurrentQuarter && viewMode === 'BASELINE'

              return (
                <div key={quarter.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Parent Node: Quarter Name */}
                  <div
                    className={`group flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      quarter.isActive
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedQuarters)
                        if (isExpanded) {
                          newExpanded.delete(quarter.id)
                        } else {
                          newExpanded.add(quarter.id)
                        }
                        setExpandedQuarters(newExpanded)
                      }}
                      className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm truncate ${
                          quarter.isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {quarter.name}
                        </span>
                        {quarter.isActive && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded flex-shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 block mt-0.5">
                        {new Date(quarter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!quarter.isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleActivateQuarter(quarter.id)
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Activate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDeleteModal(quarter)
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Child Nodes: Live / Actual and Baseline Plan */}
                  {isExpanded && (
                    <div className="pl-6 pb-1 space-y-0.5">
                      {/* Live / Actual - Always visible */}
                      <button
                        onClick={() => {
                          onQuarterChange(quarter.id)
                          onViewModeChange('LIVE')
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                          isLiveSelected
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Live / Actual
                      </button>

                      {/* Baseline Plan - Only if baseline exists */}
                      <button
                        onClick={() => {
                          if (hasBaseline) {
                            onQuarterChange(quarter.id)
                            onViewModeChange('BASELINE')
                          }
                        }}
                        disabled={!hasBaseline}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                          !hasBaseline
                            ? 'text-gray-400 cursor-not-allowed'
                            : isBaselineSelected
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        title={!hasBaseline ? 'No baseline available. Set baseline first.' : 'View Baseline Plan'}
                      >
                        Baseline Plan
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
        
        {/* Add New Quarter Button - Small icon below last quarter */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Add New Quarter"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Create Quarter Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Quarter</h3>
            <input
              type="text"
              value={newQuarterName}
              onChange={(e) => setNewQuarterName(e.target.value)}
              placeholder="e.g., Q1 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateQuarter()
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewQuarterName('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuarter}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Quarter</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{showDeleteModal.name}</strong>?
              <br />
              <span className="text-sm text-red-600">This action cannot be undone.</span>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuarter}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuarterSelector

