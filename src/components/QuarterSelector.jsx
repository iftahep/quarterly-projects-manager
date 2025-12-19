import { useState, useEffect } from 'react'
import { quarterAPI } from '../services/api'

function QuarterSelector({ currentQuarterId, onQuarterChange }) {
  const [quarters, setQuarters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newQuarterName, setNewQuarterName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(null) // quarter to delete

  useEffect(() => {
    loadQuarters()
  }, [])

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p className="text-gray-600">Loading quarters...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Quarters</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + New Quarter
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {quarters.length === 0 ? (
          <p className="text-gray-500 text-sm">No quarters yet. Create one to get started!</p>
        ) : (
          quarters.map((quarter) => (
            <div
              key={quarter.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                quarter.isActive
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{quarter.name}</span>
                {quarter.isActive && (
                  <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded">
                    Active
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(quarter.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                {!quarter.isActive && (
                  <button
                    onClick={() => handleActivateQuarter(quarter.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteModal(quarter)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
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

