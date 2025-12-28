import { useState, useEffect } from 'react'
import { quarterAPI } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'

function QuarterSelector({ currentQuarterId, onQuarterChange, viewMode, onViewModeChange, quarterBaselines }) {
  const { theme } = useTheme()
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

  // Theme-based classes - Modern SaaS Light Mode
  const textLoading = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const borderHeader = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const textTitle = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const borderQuarter = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const bgActive = theme === 'dark' ? 'bg-slate-700' : 'bg-indigo-50'
  const bgHover = theme === 'dark' ? 'bg-slate-700/50' : 'hover:bg-slate-50'
  const textQuarter = theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
  const textQuarterActive = theme === 'dark' ? 'text-slate-100' : 'text-indigo-700'
  const textDate = theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
  const textIcon = theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
  const textIconHover = theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
  const bgChild = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'
  const textChild = theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
  const textChildSelected = theme === 'dark' ? 'text-slate-100' : 'text-indigo-700'
  const textChildDisabled = theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
  const borderAdd = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const textAdd = theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
  const bgAddHover = theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
  const textAddHover = theme === 'dark' ? 'text-green-400' : 'text-green-600'
  const bgModal = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderModal = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const textModal = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const textModalSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const bgInput = theme === 'dark' ? 'bg-slate-700' : 'bg-white'
  const borderInput = theme === 'dark' ? 'border-slate-600' : 'border-slate-200'
  const bgButton = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
  const textButton = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const bgButtonHover = theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'
  const bgError = theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
  const borderError = theme === 'dark' ? 'border-red-700' : 'border-red-200'
  const textError = theme === 'dark' ? 'text-red-300' : 'text-red-700'
  const textErrorSecondary = theme === 'dark' ? 'text-red-400' : 'text-red-600'

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${textLoading} text-sm`}>Loading quarters...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className={`p-4 border-b ${borderHeader}`}>
        <h3 className={`text-lg font-semibold ${textTitle}`}>Quarters</h3>
      </div>

      {/* Quarters List */}
      <div className="flex-1 overflow-y-auto p-2">

        {error && (
          <div className={`mb-3 p-2 ${bgError} border ${borderError} rounded ${textError} text-xs`}>
            {error}
          </div>
        )}

        <div className="space-y-1">
          {quarters.length === 0 ? (
            <p className={`${textDate} text-xs p-2`}>No quarters yet. Create one to get started!</p>
          ) : (
            quarters.map((quarter) => {
              const isExpanded = expandedQuarters.has(quarter.id)
              const hasBaseline = quarterBaselines && quarterBaselines[quarter.id]
              const isCurrentQuarter = currentQuarterId === quarter.id
              const isLiveSelected = isCurrentQuarter && viewMode === 'LIVE'
              const isBaselineSelected = isCurrentQuarter && viewMode === 'BASELINE'

              return (
                <div key={quarter.id} className={`border-b ${borderQuarter} last:border-b-0`}>
                  {/* Parent Node: Quarter Name */}
                  <div
                    className={`group flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      quarter.isActive
                        ? `${bgActive} border-l-4 ${theme === 'dark' ? 'border-blue-500' : 'border-indigo-500'}`
                        : bgHover
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
                      className={`p-0.5 ${textIcon} ${theme === 'dark' ? 'hover:text-slate-200' : 'hover:text-gray-600'} transition-colors`}
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
                          quarter.isActive ? textQuarterActive : textQuarter
                        }`}>
                          {quarter.name}
                        </span>
                        {quarter.isActive && (
                          <span className={`px-1.5 py-0.5 text-[10px] text-white rounded flex-shrink-0 ${
                            theme === 'dark' ? 'bg-blue-600' : 'bg-indigo-600'
                          }`}>
                            Active
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] ${textDate} block mt-0.5`}>
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
                          className={`p-1.5 text-blue-400 ${theme === 'dark' ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'} rounded transition-colors`}
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
                        className={`p-1.5 text-red-400 ${theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} rounded transition-colors`}
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
                            ? `${bgChild} ${textChildSelected} font-medium`
                            : `${textChild} ${theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`
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
                            ? `${textChildDisabled} cursor-not-allowed`
                            : isBaselineSelected
                            ? `${bgChild} ${textChildSelected} font-medium`
                            : `${textChild} ${theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`
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
        <div className={`mt-2 pt-2 border-t ${borderAdd}`}>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`w-full flex items-center justify-center p-2 ${textAdd} ${theme === 'dark' ? 'hover:text-green-400 hover:bg-green-900/20' : 'hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${bgModal} rounded-lg p-6 max-w-md w-full mx-4 border ${borderModal}`}>
            <h3 className={`text-lg font-semibold ${textModal} mb-4`}>Create New Quarter</h3>
            <input
              type="text"
              value={newQuarterName}
              onChange={(e) => setNewQuarterName(e.target.value)}
              placeholder="e.g., Q1 2026"
              className={`w-full px-3 py-2 ${bgInput} border ${borderInput} ${textModal} rounded-md focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} mb-4 ${theme === 'dark' ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
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
                className={`px-4 py-2 ${textButton} ${bgButton} ${theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-300'} rounded-lg transition-colors`}
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${bgModal} rounded-lg p-6 max-w-md w-full mx-4 border ${borderModal}`}>
            <h3 className={`text-lg font-semibold ${textModal} mb-4`}>Delete Quarter</h3>
            <p className={`${textModalSecondary} mb-6`}>
              Are you sure you want to delete <strong className={textModal}>{showDeleteModal.name}</strong>?
              <br />
              <span className={`text-sm ${textErrorSecondary}`}>This action cannot be undone.</span>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className={`px-4 py-2 ${textButton} ${bgButton} ${theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-300'} rounded-lg transition-colors`}
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

