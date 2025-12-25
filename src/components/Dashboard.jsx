import { useState, useEffect, useCallback, useMemo } from 'react'
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

function Dashboard({ saveFunctionRef, quarterId, viewMode, onBaselineUpdated }) {
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

  // Baseline state
  const [baselineData, setBaselineData] = useState(null)
  const [showDiff, setShowDiff] = useState(false)
  const [isEditingBaseline, setIsEditingBaseline] = useState(false)


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
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to add row in locked mode. Ignoring.')
      return
    }
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
    // Prevent changes when table is locked (BASELINE view-only mode)
    const isLocked = viewMode === 'BASELINE' && !isEditingBaseline
    if (isLocked) {
      console.warn('Attempted to change cell in locked mode. Ignoring change.', { id, field, value, viewMode, isEditingBaseline })
      return
    }
    console.log('handleCellChange called:', { id, field, value, isLocked, viewMode, isEditingBaseline })
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ))
  }

  const handleDeleteRow = (projectId) => {
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to delete row in locked mode. Ignoring.')
      return
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== projectId))
    }
  }

  const handleMoveProject = (projectId, direction) => {
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to move project in locked mode. Ignoring.')
      return
    }
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
      if (quarter) {
        // Store baseline data
        if (quarter.baseline_data) {
          // Handle case where baseline_data might be a string (JSON)
          let parsedBaseline = quarter.baseline_data
          if (typeof parsedBaseline === 'string') {
            try {
              parsedBaseline = JSON.parse(parsedBaseline)
            } catch (e) {
              console.error('Error parsing baseline_data in loadFromAPI:', e)
            }
          }
          console.log('loadFromAPI - Setting baselineData:', parsedBaseline)
          setBaselineData(parsedBaseline)
        } else {
          console.log('loadFromAPI - No baseline_data found')
          setBaselineData(null)
        }
        
        // Return live data
        if (quarter.data) {
          return quarter.data
        }
      }
    } catch (error) {
      console.error('Error loading from API:', error)
    }
    return null
  }

  // Handle set baseline (Snapshot Mode)
  const handleSetBaseline = async () => {
    if (!quarterId) {
      alert('No quarter selected')
      return
    }

    if (!window.confirm('Are you sure you want to set the baseline? This will save the current state as the baseline.')) {
      return
    }

    try {
      // Save current state to baseline
      const dataToSave = {
        projects,
        backendSprints,
        androidSprints,
        iosSprints
      }
      console.log('Saving baseline with data:', dataToSave)
      console.log('Projects count:', projects.length)
      console.log('Backend sprints count:', backendSprints.length)
      await quarterAPI.setBaseline(quarterId, dataToSave)
      // Reload to get updated baseline
      const quarter = await quarterAPI.getById(quarterId)
      console.log('Quarter loaded after save:', quarter)
      if (quarter) {
        if (quarter.baseline_data) {
          // Handle case where baseline_data might be a string (JSON)
          let parsedBaseline = quarter.baseline_data
          if (typeof parsedBaseline === 'string') {
            try {
              parsedBaseline = JSON.parse(parsedBaseline)
            } catch (e) {
              console.error('Error parsing baseline_data:', e)
            }
          }
          console.log('Setting baseline data:', parsedBaseline)
          setBaselineData(parsedBaseline)
        }
        alert('Baseline set successfully!')
        // Notify parent to refresh baseline status
        if (onBaselineUpdated) {
          onBaselineUpdated()
        }
      }
    } catch (error) {
      console.error('Error setting baseline:', error)
      alert('Failed to set baseline: ' + error.message)
    }
  }

  // Handle enter edit baseline mode
  const handleEditSnapshot = () => {
    if (!baselineData) {
      alert('No baseline data available')
      return
    }
    console.log('Entering edit mode. Current baselineData:', baselineData)
    console.log('Current projects:', projects.length)
    // Ensure we're working with the baseline data
    if (baselineData.projects && Array.isArray(baselineData.projects)) {
      setProjects(baselineData.projects)
    }
    if (baselineData.backendSprints && Array.isArray(baselineData.backendSprints)) {
      setBackendSprints(baselineData.backendSprints)
    }
    if (baselineData.androidSprints && Array.isArray(baselineData.androidSprints)) {
      setAndroidSprints(baselineData.androidSprints)
    }
    if (baselineData.iosSprints && Array.isArray(baselineData.iosSprints)) {
      setIosSprints(baselineData.iosSprints)
    }
    setIsEditingBaseline(true)
    setShowDiff(false) // Disable diff when editing baseline
    console.log('Edit mode enabled. isEditingBaseline should be true')
  }

  // Handle save baseline snapshot
  const handleSaveSnapshot = async () => {
    if (!quarterId) {
      alert('No quarter selected')
      return
    }

    const dataToSave = {
      projects,
      backendSprints,
      androidSprints,
      iosSprints
    }

    try {
      await quarterAPI.setBaseline(quarterId, dataToSave)
      // Reload to get updated baseline
      const quarter = await quarterAPI.getById(quarterId)
      if (quarter) {
        if (quarter.baseline_data) {
          setBaselineData(quarter.baseline_data)
        }
      }
      setIsEditingBaseline(false)
      alert('Baseline snapshot saved successfully!')
      // Notify parent to refresh baseline status
      if (onBaselineUpdated) {
        onBaselineUpdated()
      }
    } catch (error) {
      console.error('Error saving baseline:', error)
      alert('Failed to save baseline')
    }
  }

  // Handle cancel edit baseline
  const handleCancelEditBaseline = async () => {
    // Reload baseline data from API
    const quarter = await quarterAPI.getById(quarterId)
    if (quarter && quarter.baseline_data) {
      // Handle case where baseline_data might be a string (JSON)
      let parsedBaseline = quarter.baseline_data
      if (typeof parsedBaseline === 'string') {
        try {
          parsedBaseline = JSON.parse(parsedBaseline)
        } catch (e) {
          console.error('Error parsing baseline_data:', e)
        }
      }
      if (parsedBaseline.projects) setProjects(parsedBaseline.projects)
      if (parsedBaseline.backendSprints) setBackendSprints(parsedBaseline.backendSprints)
      if (parsedBaseline.androidSprints) setAndroidSprints(parsedBaseline.androidSprints)
      if (parsedBaseline.iosSprints) setIosSprints(parsedBaseline.iosSprints)
      // Update baselineData state
      setBaselineData(parsedBaseline)
    }
    setIsEditingBaseline(false)
  }

  // Load live data when quarterId changes or when switching to LIVE mode
  useEffect(() => {
    if (quarterId && viewMode === 'LIVE') {
      loadFromAPI().then((savedData) => {
        if (savedData) {
          if (savedData.projects) setProjects(savedData.projects)
          if (savedData.backendSprints) setBackendSprints(savedData.backendSprints)
          if (savedData.androidSprints) setAndroidSprints(savedData.androidSprints)
          if (savedData.iosSprints) setIosSprints(savedData.iosSprints)
        }
      })
      setIsEditingBaseline(false) // Reset edit mode
    }
  }, [quarterId, viewMode === 'LIVE' ? viewMode : null]) // Reload when quarter changes or switching to LIVE

  // Load baseline data when switching to BASELINE mode
  useEffect(() => {
    if (quarterId && viewMode === 'BASELINE') {
      // Load from API to get baseline_data
      quarterAPI.getById(quarterId).then((quarter) => {
        console.log('Loaded quarter for baseline:', quarter)
        if (quarter && quarter.baseline_data) {
          // Handle case where baseline_data might be a string (JSON)
          let parsedBaseline = quarter.baseline_data
          if (typeof parsedBaseline === 'string') {
            try {
              parsedBaseline = JSON.parse(parsedBaseline)
            } catch (e) {
              console.error('Error parsing baseline_data:', e)
            }
          }
          console.log('Parsed baseline data:', parsedBaseline)
          setBaselineData(parsedBaseline)
        } else {
          console.log('No baseline_data found')
          setBaselineData(null)
        }
      }).catch((error) => {
        console.error('Error loading baseline:', error)
      })
    }
  }, [quarterId, viewMode])

  // Update displayed data when baselineData changes in BASELINE mode
  // Only update if NOT in edit mode (to prevent overwriting user edits)
  useEffect(() => {
    if (quarterId && viewMode === 'BASELINE' && baselineData && !isEditingBaseline) {
      console.log('Updating displayed data from baseline:', baselineData)
      if (baselineData.projects && Array.isArray(baselineData.projects)) {
        console.log('Setting projects:', baselineData.projects.length, 'projects')
        setProjects(baselineData.projects)
      }
      if (baselineData.backendSprints && Array.isArray(baselineData.backendSprints)) {
        console.log('Setting backend sprints:', baselineData.backendSprints.length, 'sprints')
        setBackendSprints(baselineData.backendSprints)
      }
      if (baselineData.androidSprints && Array.isArray(baselineData.androidSprints)) {
        console.log('Setting android sprints:', baselineData.androidSprints.length, 'sprints')
        setAndroidSprints(baselineData.androidSprints)
      }
      if (baselineData.iosSprints && Array.isArray(baselineData.iosSprints)) {
        console.log('Setting ios sprints:', baselineData.iosSprints.length, 'sprints')
        setIosSprints(baselineData.iosSprints)
      }
    }
  }, [baselineData, viewMode, quarterId, isEditingBaseline])

  // Expose save function and setBaseline to parent component via ref
  useEffect(() => {
    if (saveFunctionRef) {
      saveFunctionRef.current = {
        save: saveToAPI,
        setBaseline: handleSetBaseline
      }
    }
  }, [projects, backendSprints, androidSprints, iosSprints, quarterId, saveFunctionRef])

  // Sprint table handlers
  const handleAddSprint = (type) => {
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to add sprint in locked mode. Ignoring.')
      return
    }
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
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to delete sprint in locked mode. Ignoring.')
      return
    }
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
    // Prevent changes when table is locked
    if (viewMode === 'BASELINE' && !isEditingBaseline) {
      console.warn('Attempted to change sprint in locked mode. Ignoring.')
      return
    }
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

  // Calculate balance (Actual - Require) - OLD VERSION, use calculateBalanceDisplay instead
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

  // Determine which data to display based on viewMode
  // In BASELINE view-only mode: use baselineData (read-only)
  // In BASELINE edit mode: use projects (editable)
  // In LIVE mode: use projects (editable)
  const displayProjects = (viewMode === 'BASELINE' && baselineData && !isEditingBaseline)
    ? (baselineData.projects || [])
    : projects
  
  const displayBackendSprints = (viewMode === 'BASELINE' && baselineData && !isEditingBaseline)
    ? (baselineData.backendSprints || [])
    : backendSprints
  
  const displayAndroidSprints = (viewMode === 'BASELINE' && baselineData && !isEditingBaseline)
    ? (baselineData.androidSprints || [])
    : androidSprints
  
  const displayIosSprints = (viewMode === 'BASELINE' && baselineData && !isEditingBaseline)
    ? (baselineData.iosSprints || [])
    : iosSprints

  // Table is locked only in BASELINE view mode when not editing
  const isTableLocked = useMemo(() => {
    const locked = viewMode === 'BASELINE' && !isEditingBaseline
    console.log('isTableLocked calculated:', { viewMode, isEditingBaseline, locked })
    return locked
  }, [viewMode, isEditingBaseline])

  // Wrapper functions for calculations that use displayProjects instead of projects
  const calculateTotalDisplay = (field) => {
    return displayProjects.reduce((sum, project) => {
      const value = parseFloat(project[field]) || 0
      return sum + value
    }, 0)
  }

  const calculateSprintAllocatedDisplay = (type, sprintId) => {
    const fieldName = `${type}_${sprintId}`
    return displayProjects.reduce((sum, project) => {
      const value = parseFloat(project[fieldName]) || 0
      return sum + value
    }, 0)
  }

  const calculateProjectAllocatedDisplay = (project, type) => {
    let total = 0
    let sprints = []
    if (type === 'backend') sprints = displayBackendSprints
    else if (type === 'android') sprints = displayAndroidSprints
    else if (type === 'ios') sprints = displayIosSprints
    
    sprints.forEach(sprint => {
      const value = parseFloat(project[`${type}_${sprint.id}`]) || 0
      total += value
    })
    return total
  }

  const calculateProjectBalanceDisplay = (project, type) => {
    const require = parseFloat(project[type]) || 0
    const allocated = calculateProjectAllocatedDisplay(project, type)
    return require - allocated
  }

  const getSprintCapacityDisplay = (type, sprintId) => {
    let sprints = []
    if (type === 'backend') sprints = displayBackendSprints
    else if (type === 'android') sprints = displayAndroidSprints
    else if (type === 'ios') sprints = displayIosSprints
    
    const sprint = sprints.find(s => s.id === sprintId)
    return sprint ? (parseFloat(sprint.capacity) || 0) : 0
  }

  const calculateSprintBalanceDisplay = (type, sprintId) => {
    const capacity = getSprintCapacityDisplay(type, sprintId)
    const allocated = calculateSprintAllocatedDisplay(type, sprintId)
    return capacity - allocated
  }

  const getBalanceCapacityDisplay = (type) => {
    if (type === 'backend') return calculateActual(displayBackendSprints)
    else if (type === 'android') return calculateActual(displayAndroidSprints)
    else if (type === 'ios') return calculateActual(displayIosSprints)
    return 0
  }

  const calculateBalanceDisplay = (type) => {
    const require = calculateTotalDisplay(type)
    const actual = getBalanceCapacityDisplay(type)
    return actual - require
  }

  // For diff comparison: in LIVE mode, compare against baseline; in BASELINE mode, no diff
  const diffBaselineData = viewMode === 'LIVE' ? baselineData : null

  return (
    <div className="space-y-6 pb-20 px-4 py-4">
      {/* Baseline View Banner */}
      {viewMode === 'BASELINE' && (
        <div className="bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold text-lg">Viewing Baseline Snapshot</span>
              {isEditingBaseline && (
                <span className="ml-2 px-2 py-1 bg-orange-500 rounded text-sm">(Editing)</span>
              )}
            </div>
            {!isEditingBaseline ? (
              <button
                onClick={handleEditSnapshot}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Snapshot
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEditBaseline}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSnapshot}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Snapshot
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show Changes Toggle - Only visible in LIVE mode if baseline exists */}
      {viewMode === 'LIVE' && baselineData && (
        <div className="mb-4 flex items-center justify-end gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDiff}
              onChange={(e) => setShowDiff(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Changes</span>
          </label>
        </div>
      )}
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
          projects={displayProjects}
          backendSprints={displayBackendSprints}
          androidSprints={displayAndroidSprints}
          iosSprints={displayIosSprints}
          showBackendSprints={showBackendSprints}
          showAndroidSprints={showAndroidSprints}
          showIosSprints={showIosSprints}
          setShowBackendSprints={setShowBackendSprints}
          setShowAndroidSprints={setShowAndroidSprints}
          setShowIosSprints={setShowIosSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          handleDeleteRow={handleDeleteRow}
          formatNumber={formatNumber}
          calculateTotal={calculateTotalDisplay}
          calculateProjectAllocated={calculateProjectAllocatedDisplay}
          calculateProjectBalance={calculateProjectBalanceDisplay}
          calculateSprintAllocated={calculateSprintAllocatedDisplay}
          calculateSprintBalance={calculateSprintBalanceDisplay}
          getSprintCapacity={getSprintCapacityDisplay}
          handleSprintChange={handleSprintChange}
          handleAddSprint={handleAddSprint}
          handleDeleteSprint={handleDeleteSprint}
          showGanttModal={showGanttModal}
          setShowGanttModal={setShowGanttModal}
          baselineData={diffBaselineData}
          showDiff={showDiff}
          isTableLocked={isTableLocked}
        />
      )}

      {activeTab === 'Backend' && (
        <TeamTab
          team="backend"
          projects={displayProjects}
          sprints={displayBackendSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          handleDeleteRow={handleDeleteRow}
          formatNumber={formatNumber}
          calculateTotal={calculateTotalDisplay}
          calculateProjectAllocated={calculateProjectAllocatedDisplay}
          calculateProjectBalance={calculateProjectBalanceDisplay}
          calculateSprintAllocated={calculateSprintAllocatedDisplay}
          calculateSprintBalance={calculateSprintBalanceDisplay}
          getSprintCapacity={getSprintCapacityDisplay}
          baselineData={diffBaselineData}
          showDiff={showDiff}
          isTableLocked={isTableLocked}
        />
      )}

      {activeTab === 'Android' && (
        <TeamTab
          team="android"
          projects={displayProjects}
          sprints={displayAndroidSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          handleDeleteRow={handleDeleteRow}
          formatNumber={formatNumber}
          calculateTotal={calculateTotalDisplay}
          calculateProjectAllocated={calculateProjectAllocatedDisplay}
          calculateProjectBalance={calculateProjectBalanceDisplay}
          calculateSprintAllocated={calculateSprintAllocatedDisplay}
          calculateSprintBalance={calculateSprintBalanceDisplay}
          getSprintCapacity={getSprintCapacityDisplay}
          baselineData={diffBaselineData}
          showDiff={showDiff}
          isTableLocked={isTableLocked}
        />
      )}

      {activeTab === 'iOS' && (
        <TeamTab
          team="ios"
          projects={displayProjects}
          sprints={displayIosSprints}
          handleAddRow={handleAddRow}
          handleCellChange={handleCellChange}
          handleMoveProject={handleMoveProject}
          handleDeleteRow={handleDeleteRow}
          formatNumber={formatNumber}
          calculateTotal={calculateTotalDisplay}
          calculateProjectAllocated={calculateProjectAllocatedDisplay}
          calculateProjectBalance={calculateProjectBalanceDisplay}
          calculateSprintAllocated={calculateSprintAllocatedDisplay}
          calculateSprintBalance={calculateSprintBalanceDisplay}
          getSprintCapacity={getSprintCapacityDisplay}
          baselineData={diffBaselineData}
          showDiff={showDiff}
          isTableLocked={isTableLocked}
        />
      )}

      {/* Sticky Footer Status Bar - Only show in Overview tab */}
      {activeTab === 'Overview' && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
          <div className="px-4 py-3">
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
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {calculateBalance('android')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">iOS:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  calculateBalance('ios') < 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-orange-100 text-orange-700'
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
