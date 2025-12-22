import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { quarterAPI } from '../services/api'
import GanttModal from './GanttModal'
import OverviewTab from './OverviewTab'
import TeamTab from './TeamTab'

const OWNER_OPTIONS = ['Oren', 'Shchory', 'Bar', 'Ben', 'Ohad', 'Ronen', 'Jenny', 'Aharoni', 'Rick']
const TECH_OWNER_OPTIONS = ['Vitaly', 'Stas', 'Semyon', 'Dzimtry', 'Kirill', 'Shalom', 'Aharoni', 'Jenny']

// SprintTable component - defined outside to prevent re-creation on each render
const SprintTable = React.memo(({ title, sprints, type, onSprintChange, onAddSprint, onDeleteSprint, formatNumber }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <button
        onClick={() => onAddSprint(type)}
        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        + Add
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sprint Name
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sprints.map((sprint) => (
            <tr key={sprint.id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={sprint.name || ''}
                  onChange={(e) => onSprintChange(type, sprint.id, 'name', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sprint name"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={formatNumber(sprint.capacity)}
                  onChange={(e) => onSprintChange(type, sprint.id, 'capacity', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => onDeleteSprint(type, sprint.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete sprint"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
))

function Dashboard({ saveFunctionRef, quarterId }) {
  // Initialize sprint capacity tables state
  const [backendSprints, setBackendSprints] = useState([
    { id: 1, name: 'Sprint 1', capacity: '' },
    { id: 2, name: 'Sprint 2', capacity: '' }
  ])
  const [androidSprints, setAndroidSprints] = useState([
    { id: 1, name: 'Sprint 1', capacity: '' },
    { id: 2, name: 'Sprint 2', capacity: '' }
  ])
  const [iosSprints, setIosSprints] = useState([
    { id: 1, name: 'Sprint 1', capacity: '' },
    { id: 2, name: 'Sprint 2', capacity: '' }
  ])

  // Visibility toggles for sprint columns
  const [showBackendSprints, setShowBackendSprints] = useState(true)
  const [showAndroidSprints, setShowAndroidSprints] = useState(true)
  const [showIosSprints, setShowIosSprints] = useState(true)

  // Gantt Modal state
  const [showGanttModal, setShowGanttModal] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState('Overview')


  // Initialize sprint allocations for a project
  const initializeSprintAllocations = () => {
    const allocations = {}
    backendSprints.forEach(sprint => {
      allocations[`backend_${sprint.id}`] = ''
    })
    androidSprints.forEach(sprint => {
      allocations[`android_${sprint.id}`] = ''
    })
    iosSprints.forEach(sprint => {
      allocations[`ios_${sprint.id}`] = ''
    })
    return allocations
  }

  const [projects, setProjects] = useState(() => {
    const initialSprints = [
      { id: 1, name: 'Sprint 1', capacity: '' },
      { id: 2, name: 'Sprint 2', capacity: '' }
    ]
    const allocations = {}
    initialSprints.forEach(sprint => {
      allocations[`backend_${sprint.id}`] = ''
      allocations[`android_${sprint.id}`] = ''
      allocations[`ios_${sprint.id}`] = ''
    })
    return [{
      id: 1,
      epic: '',
      owner: '',
      techOwner: '',
      backend: '',
      android: '',
      ios: '',
      ...allocations
    }]
  })


  const handleAddRow = () => {
    const newProject = {
      id: Date.now(),
      epic: '',
      owner: '',
      techOwner: '',
      backend: '',
      android: '',
      ios: '',
      ...initializeSprintAllocations()
    }
    setProjects([...projects, newProject])
  }

  const handleCellChange = (id, field, value) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ))
  }

  const handleMoveProject = (projectId, direction) => {
    const currentIndex = projects.findIndex(p => p.id === projectId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    // Check bounds
    if (newIndex < 0 || newIndex >= projects.length) return

    // Create new array with swapped items
    const newProjects = [...projects]
    const temp = newProjects[currentIndex]
    newProjects[currentIndex] = newProjects[newIndex]
    newProjects[newIndex] = temp
    
    setProjects(newProjects)
  }

  const calculateTotal = (field) => {
    return projects.reduce((sum, project) => {
      const value = parseFloat(project[field]) || 0
      return sum + value
    }, 0)
  }

  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return ''
    const num = parseFloat(value)
    return isNaN(num) ? '' : num.toString()
  }

  // API functions
  const saveToAPI = async () => {
    if (!quarterId) {
      console.error('No quarter ID available')
      return false
    }

    const dataToSave = {
      projects,
      backendSprints,
      androidSprints,
      iosSprints
    }

    try {
      await quarterAPI.update(quarterId, { data: dataToSave })
      return true
    } catch (error) {
      console.error('Error saving to API:', error)
      return false
    }
  }

  const loadFromAPI = async () => {
    if (!quarterId) return null

    try {
      const quarter = await quarterAPI.getById(quarterId)
      if (quarter && quarter.data) {
        return quarter.data
      }
    } catch (error) {
      console.error('Error loading from API:', error)
    }
    return null
  }

  // Load data when quarterId changes
  useEffect(() => {
    if (quarterId) {
      loadFromAPI().then((savedData) => {
        if (savedData) {
          if (savedData.projects) setProjects(savedData.projects)
          if (savedData.backendSprints) setBackendSprints(savedData.backendSprints)
          if (savedData.androidSprints) setAndroidSprints(savedData.androidSprints)
          if (savedData.iosSprints) setIosSprints(savedData.iosSprints)
        }
      })
    }
  }, [quarterId]) // Reload when quarter changes

  // Expose save function to parent component via ref
  useEffect(() => {
    if (saveFunctionRef) {
      saveFunctionRef.current = saveToAPI
    }
  }, [projects, backendSprints, androidSprints, iosSprints, quarterId, saveFunctionRef])

  // Sprint table handlers
  const handleAddSprint = (type) => {
    const newSprint = {
      id: Date.now(),
      name: '',
      capacity: ''
    }
    if (type === 'backend') {
      setBackendSprints([...backendSprints, newSprint])
      // Add allocation field to all projects
      setProjects(prevProjects => prevProjects.map(project => ({
        ...project,
        [`backend_${newSprint.id}`]: ''
      })))
    } else if (type === 'android') {
      setAndroidSprints([...androidSprints, newSprint])
      setProjects(prevProjects => prevProjects.map(project => ({
        ...project,
        [`android_${newSprint.id}`]: ''
      })))
    } else if (type === 'ios') {
      setIosSprints([...iosSprints, newSprint])
      setProjects(prevProjects => prevProjects.map(project => ({
        ...project,
        [`ios_${newSprint.id}`]: ''
      })))
    }
  }

  const handleDeleteSprint = (type, id) => {
    if (type === 'backend') {
      setBackendSprints(backendSprints.filter(sprint => sprint.id !== id))
      // Remove allocation field from all projects
      setProjects(projects.map(project => {
        const updated = { ...project }
        delete updated[`backend_${id}`]
        return updated
      }))
    } else if (type === 'android') {
      setAndroidSprints(androidSprints.filter(sprint => sprint.id !== id))
      setProjects(projects.map(project => {
        const updated = { ...project }
        delete updated[`android_${id}`]
        return updated
      }))
    } else if (type === 'ios') {
      setIosSprints(iosSprints.filter(sprint => sprint.id !== id))
      setProjects(projects.map(project => {
        const updated = { ...project }
        delete updated[`ios_${id}`]
        return updated
      }))
    }
  }

  const handleSprintChange = (type, id, field, value) => {
    if (type === 'backend') {
      setBackendSprints(prevSprints => prevSprints.map(sprint =>
        sprint.id === id ? { ...sprint, [field]: value } : sprint
      ))
    } else if (type === 'android') {
      setAndroidSprints(prevSprints => prevSprints.map(sprint =>
        sprint.id === id ? { ...sprint, [field]: value } : sprint
      ))
    } else if (type === 'ios') {
      setIosSprints(prevSprints => prevSprints.map(sprint =>
        sprint.id === id ? { ...sprint, [field]: value } : sprint
      ))
    }
  }

  // Calculate actual capacity from sprint tables
  const calculateActual = (sprints) => {
    return sprints.reduce((sum, sprint) => {
      const value = parseFloat(sprint.capacity) || 0
      return sum + value
    }, 0)
  }

  // Get balance capacity (calculated from sprint tables)
  const getBalanceCapacity = (type) => {
    if (type === 'backend') return calculateActual(backendSprints)
    else if (type === 'android') return calculateActual(androidSprints)
    else if (type === 'ios') return calculateActual(iosSprints)
    return 0
  }

  // Calculate balance (Actual - Require)
  const calculateBalance = (type) => {
    const require = calculateTotal(type)
    const actual = getBalanceCapacity(type)
    return actual - require
  }

  // Calculate total allocated for a specific sprint
  const calculateSprintAllocated = (type, sprintId) => {
    const fieldName = `${type}_${sprintId}`
    return projects.reduce((sum, project) => {
      const value = parseFloat(project[fieldName]) || 0
      return sum + value
    }, 0)
  }

  // Calculate total allocated for a specific project across all sprints of a type
  const calculateProjectAllocated = (project, type) => {
    let total = 0
    let sprints = []
    if (type === 'backend') sprints = backendSprints
    else if (type === 'android') sprints = androidSprints
    else if (type === 'ios') sprints = iosSprints
    
    sprints.forEach(sprint => {
      const fieldName = `${type}_${sprint.id}`
      const value = parseFloat(project[fieldName]) || 0
      total += value
    })
    return total
  }

  // Calculate balance for a specific project (Require - Allocated)
  const calculateProjectBalance = (project, type) => {
    const require = parseFloat(project[type]) || 0
    const allocated = calculateProjectAllocated(project, type)
    return require - allocated
  }

  // Get sprint capacity
  const getSprintCapacity = (type, sprintId) => {
    let sprints = []
    if (type === 'backend') sprints = backendSprints
    else if (type === 'android') sprints = androidSprints
    else if (type === 'ios') sprints = iosSprints
    
    const sprint = sprints.find(s => s.id === sprintId)
    return sprint ? (parseFloat(sprint.capacity) || 0) : 0
  }

  // Calculate sprint balance (Capacity - Allocated)
  const calculateSprintBalance = (type, sprintId) => {
    const capacity = getSprintCapacity(type, sprintId)
    const allocated = calculateSprintAllocated(type, sprintId)
    return capacity - allocated
  }


  // Tab navigation
  const tabs = ['Overview', 'Backend', 'Android', 'iOS']

  return (
    <div className="space-y-6 pb-20">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <OverviewTab
          projects={projects}
          backendSprints={backendSprints}
          androidSprints={androidSprints}
          iosSprints={iosSprints}
          showBackendSprints={showBackendSprints}
          showAndroidSprints={showAndroidSprints}
          showIosSprints={showIosSprints}
          setShowBackendSprints={setShowBackendSprints}
          setShowAndroidSprints={setShowAndroidSprints}
          setShowIosSprints={setShowIosSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          formatNumber={formatNumber}
          calculateTotal={calculateTotal}
          calculateProjectAllocated={calculateProjectAllocated}
          calculateProjectBalance={calculateProjectBalance}
          calculateSprintAllocated={calculateSprintAllocated}
          calculateSprintBalance={calculateSprintBalance}
          getSprintCapacity={getSprintCapacity}
          handleSprintChange={handleSprintChange}
          handleAddSprint={handleAddSprint}
          handleDeleteSprint={handleDeleteSprint}
          showGanttModal={showGanttModal}
          setShowGanttModal={setShowGanttModal}
        />
      )}

      {activeTab === 'Backend' && (
        <TeamTab
          team="backend"
          projects={projects}
          sprints={backendSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          formatNumber={formatNumber}
          calculateTotal={calculateTotal}
          calculateProjectAllocated={calculateProjectAllocated}
          calculateProjectBalance={calculateProjectBalance}
          calculateSprintAllocated={calculateSprintAllocated}
          calculateSprintBalance={calculateSprintBalance}
          getSprintCapacity={getSprintCapacity}
        />
      )}

      {activeTab === 'Android' && (
        <TeamTab
          team="android"
          projects={projects}
          sprints={androidSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          formatNumber={formatNumber}
          calculateTotal={calculateTotal}
          calculateProjectAllocated={calculateProjectAllocated}
          calculateProjectBalance={calculateProjectBalance}
          calculateSprintAllocated={calculateSprintAllocated}
          calculateSprintBalance={calculateSprintBalance}
          getSprintCapacity={getSprintCapacity}
        />
      )}

      {activeTab === 'iOS' && (
        <TeamTab
          team="ios"
          projects={projects}
          sprints={iosSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          formatNumber={formatNumber}
          calculateTotal={calculateTotal}
          calculateProjectAllocated={calculateProjectAllocated}
          calculateProjectBalance={calculateProjectBalance}
          calculateSprintAllocated={calculateSprintAllocated}
          calculateSprintBalance={calculateSprintBalance}
          getSprintCapacity={getSprintCapacity}
        />
      )}

      {/* Sticky Footer Status Bar - Only show in Overview tab */}
      {activeTab === 'Overview' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Backend:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  calculateBalance('backend') < 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {calculateBalance('backend')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Android:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  calculateBalance('android') < 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {calculateBalance('android')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">iOS:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  calculateBalance('ios') < 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {calculateBalance('ios')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart Modal - Only show in Overview tab */}
      {activeTab === 'Overview' && (
        <GanttModal
          isOpen={showGanttModal}
          onClose={() => setShowGanttModal(false)}
          projects={projects}
          backendSprints={backendSprints}
          androidSprints={androidSprints}
          iosSprints={iosSprints}
        />
      )}
    </div>
  )
}

export default Dashboard
