import { useState, useEffect, useCallback } from 'react'
import React from 'react'

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
            <tr key={sprint.id} className="hover:bg-gray-50 transition-colors">
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
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
))

function Dashboard({ saveFunctionRef }) {
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

  // LocalStorage functions
  const STORAGE_KEY = 'quarterly-projects-manager-data'

  const saveToLocalStorage = () => {
    const dataToSave = {
      projects,
      backendSprints,
      androidSprints,
      iosSprints
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        return parsed
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    return null
  }

  // Load data on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    if (savedData) {
      if (savedData.projects) setProjects(savedData.projects)
      if (savedData.backendSprints) setBackendSprints(savedData.backendSprints)
      if (savedData.androidSprints) setAndroidSprints(savedData.androidSprints)
      if (savedData.iosSprints) setIosSprints(savedData.iosSprints)
    }
  }, []) // Only run on mount

  // Expose save function to parent component via ref
  useEffect(() => {
    if (saveFunctionRef) {
      saveFunctionRef.current = saveToLocalStorage
    }
  }, [projects, backendSprints, androidSprints, iosSprints, saveFunctionRef])

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


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects Table</h2>
          <p className="text-gray-600">
            Manage quarterly projects and effort estimation
          </p>
        </div>
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          + Add Row
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Epic
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Tech Owner
                </th>
                {/* Backend Team Columns */}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-green-50">
                  Backend
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-green-50">
                  Backend Allocated
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r-4 border-gray-400 bg-green-50">
                  Backend Balance
                </th>
                
                {/* Android Team Columns */}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-blue-50">
                  Android
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-blue-50">
                  Android Allocated
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r-4 border-gray-400 bg-blue-50">
                  Android Balance
                </th>
                
                {/* iOS Team Columns */}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-orange-50">
                  iOS
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-orange-50">
                  iOS Allocated
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r-2 border-gray-300 bg-orange-50">
                  iOS Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  {/* Epic - Text Input */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    <input
                      type="text"
                      value={project.epic}
                      onChange={(e) => handleCellChange(project.id, 'epic', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter epic name"
                    />
                  </td>
                  
                  {/* Owner - Select Dropdown */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    <select
                      value={project.owner}
                      onChange={(e) => handleCellChange(project.id, 'owner', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Owner</option>
                      {OWNER_OPTIONS.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Tech Owner - Select Dropdown */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    <select
                      value={project.techOwner}
                      onChange={(e) => handleCellChange(project.id, 'techOwner', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Tech Owner</option>
                      {TECH_OWNER_OPTIONS.map((techOwner) => (
                        <option key={techOwner} value={techOwner}>
                          {techOwner}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Backend Team Columns */}
                  <td className="px-4 py-3 border-r border-gray-200 bg-green-50">
                    <input
                      type="number"
                      value={formatNumber(project.backend)}
                      onChange={(e) => handleCellChange(project.id, 'backend', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-4 py-3 border-r border-gray-200 bg-green-50 text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'backend') || 0}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 border-r-4 border-gray-400 bg-green-50 text-center">
                    <span className={`text-sm font-semibold ${
                      calculateProjectBalance(project, 'backend') < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, 'backend') > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, 'backend')}
                    </span>
                  </td>
                  
                  {/* Android Team Columns */}
                  <td className="px-4 py-3 border-r border-gray-200 bg-blue-50">
                    <input
                      type="number"
                      value={formatNumber(project.android)}
                      onChange={(e) => handleCellChange(project.id, 'android', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-4 py-3 border-r border-gray-200 bg-blue-50 text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'android') || 0}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 border-r-4 border-gray-400 bg-blue-50 text-center">
                    <span className={`text-sm font-semibold ${
                      calculateProjectBalance(project, 'android') < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, 'android') > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, 'android')}
                    </span>
                  </td>
                  
                  {/* iOS Team Columns */}
                  <td className="px-4 py-3 border-r border-gray-200 bg-orange-50">
                    <input
                      type="number"
                      value={formatNumber(project.ios)}
                      onChange={(e) => handleCellChange(project.id, 'ios', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-4 py-3 border-r border-gray-200 bg-orange-50 text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'ios') || 0}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 border-r-2 border-gray-300 bg-orange-50 text-center">
                    <span className={`text-sm font-semibold ${
                      calculateProjectBalance(project, 'ios') < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, 'ios') > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, 'ios')}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Summary Row - Require */}
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                <td className="px-4 py-3 border-r border-gray-200">
                  <span className="text-sm text-gray-700">Require</span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200"></td>
                <td className="px-4 py-3 border-r border-gray-200"></td>
                
                {/* Backend Team Summary */}
                <td className="px-4 py-3 border-r border-gray-200 bg-green-50 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('backend') || 0}</span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 bg-green-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'backend'), 0) || 0}
                  </span>
                </td>
                <td className="px-4 py-3 border-r-4 border-gray-400 bg-green-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'backend'), 0) || 0}
                  </span>
                </td>
                
                {/* Android Team Summary */}
                <td className="px-4 py-3 border-r border-gray-200 bg-blue-50 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('android') || 0}</span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 bg-blue-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'android'), 0) || 0}
                  </span>
                </td>
                <td className="px-4 py-3 border-r-4 border-gray-400 bg-blue-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'android'), 0) || 0}
                  </span>
                </td>
                
                {/* iOS Team Summary */}
                <td className="px-4 py-3 border-r border-gray-200 bg-orange-50 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('ios') || 0}</span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 bg-orange-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'ios'), 0) || 0}
                  </span>
                </td>
                <td className="px-4 py-3 border-r-2 border-gray-300 bg-orange-50 text-center">
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'ios'), 0) || 0}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Summary Table - Above Resource Planning */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Balance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Metric
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Backend
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Android
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  iOS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Require Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-3 border-r border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Require</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('backend') || 0}</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('android') || 0}</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="text-sm text-gray-900">{calculateTotal('ios') || 0}</span>
                </td>
              </tr>
              
              {/* Capacity Row - Calculated from Sprint Tables */}
              <tr className="bg-gray-50">
                <td className="px-6 py-3 border-r border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Capacity</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className="text-sm text-gray-900">{getBalanceCapacity('backend') || 0}</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className="text-sm text-gray-900">{getBalanceCapacity('android') || 0}</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="text-sm text-gray-900">{getBalanceCapacity('ios') || 0}</span>
                </td>
              </tr>
              
              {/* Balance Row */}
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                <td className="px-6 py-3 border-r border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Balance</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className={`text-sm font-semibold ${
                    calculateBalance('backend') < 0 ? 'text-red-600' : 
                    calculateBalance('backend') > 0 ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {calculateBalance('backend')}
                  </span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className={`text-sm font-semibold ${
                    calculateBalance('android') < 0 ? 'text-red-600' : 
                    calculateBalance('android') > 0 ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {calculateBalance('android')}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`text-sm font-semibold ${
                    calculateBalance('ios') < 0 ? 'text-red-600' : 
                    calculateBalance('ios') > 0 ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {calculateBalance('ios')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sprint Allocation Table */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sprint Allocation</h2>
          <p className="text-gray-600">
            Allocate effort to specific sprints for each project
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r-2 border-gray-300 sticky left-0 bg-gray-50 z-10" style={{ minWidth: '250px', width: '250px' }}>
                    Epic
                  </th>
                  
                  {/* Backend Sprint Columns */}
                  {backendSprints.map((sprint) => (
                    <th
                      key={`backend_${sprint.id}`}
                      className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-green-50"
                      title={sprint.name || 'Unnamed Sprint'}
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      {sprint.name || 'Sprint'}
                    </th>
                  ))}
                  
                  {/* Android Sprint Columns */}
                  {androidSprints.map((sprint) => (
                    <th
                      key={`android_${sprint.id}`}
                      className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-blue-50"
                      title={sprint.name || 'Unnamed Sprint'}
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      {sprint.name || 'Sprint'}
                    </th>
                  ))}
                  
                  {/* iOS Sprint Columns */}
                  {iosSprints.map((sprint) => (
                    <th
                      key={`ios_${sprint.id}`}
                      className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-orange-50"
                      title={sprint.name || 'Unnamed Sprint'}
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      {sprint.name || 'Sprint'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-r-2 border-gray-300 sticky left-0 bg-white z-10" style={{ minWidth: '250px', width: '250px' }}>
                      <span className="text-sm font-medium text-gray-900">{project.epic || 'Unnamed Epic'}</span>
                    </td>
                    
                    {/* Backend Sprint Columns */}
                    {backendSprints.map((sprint) => (
                      <td key={`backend_${sprint.id}`} className="px-2 py-3 border-r border-gray-200 bg-green-50" style={{ minWidth: '80px', width: '80px' }}>
                        <input
                          type="number"
                          value={formatNumber(project[`backend_${sprint.id}`])}
                          onChange={(e) => handleCellChange(project.id, `backend_${sprint.id}`, e.target.value)}
                          className="w-full px-1 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                          placeholder="0"
                          min="0"
                          step="0.5"
                        />
                      </td>
                    ))}
                    
                    {/* Android Sprint Columns */}
                    {androidSprints.map((sprint) => (
                      <td key={`android_${sprint.id}`} className="px-2 py-3 border-r border-gray-200 bg-blue-50" style={{ minWidth: '80px', width: '80px' }}>
                        <input
                          type="number"
                          value={formatNumber(project[`android_${sprint.id}`])}
                          onChange={(e) => handleCellChange(project.id, `android_${sprint.id}`, e.target.value)}
                          className="w-full px-1 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                          placeholder="0"
                          min="0"
                          step="0.5"
                        />
                      </td>
                    ))}
                    
                    {/* iOS Sprint Columns */}
                    {iosSprints.map((sprint) => (
                      <td key={`ios_${sprint.id}`} className="px-2 py-3 border-r border-gray-200 bg-orange-50" style={{ minWidth: '80px', width: '80px' }}>
                        <input
                          type="number"
                          value={formatNumber(project[`ios_${sprint.id}`])}
                          onChange={(e) => handleCellChange(project.id, `ios_${sprint.id}`, e.target.value)}
                          className="w-full px-1 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                          placeholder="0"
                          min="0"
                          step="0.5"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Summary Row with Footers */}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td className="px-4 py-3 border-r-2 border-gray-300 sticky left-0 bg-gray-100 z-10" style={{ minWidth: '250px', width: '250px' }}>
                    <span className="text-sm text-gray-700">Summary</span>
                  </td>
                  
                  {/* Backend Sprint Footers */}
                  {backendSprints.map((sprint) => (
                    <td key={`backend_footer_${sprint.id}`} className="px-2 py-2 border-r border-gray-200 bg-green-50 text-center" style={{ minWidth: '80px', width: '80px' }}>
                      <div className="text-xs space-y-1">
                        <div className="text-gray-600">Allocated: {calculateSprintAllocated('backend', sprint.id) || 0}</div>
                        <div className="text-gray-600">Capacity: {getSprintCapacity('backend', sprint.id) || 0}</div>
                        <div className={`font-semibold ${
                          calculateSprintBalance('backend', sprint.id) < 0 ? 'text-red-600' : 
                          calculateSprintBalance('backend', sprint.id) > 0 ? 'text-green-600' : 
                          'text-gray-900'
                        }`}>
                          Balance: {calculateSprintBalance('backend', sprint.id)}
                        </div>
                      </div>
                    </td>
                  ))}
                  
                  {/* Android Sprint Footers */}
                  {androidSprints.map((sprint) => (
                    <td key={`android_footer_${sprint.id}`} className="px-2 py-2 border-r border-gray-200 bg-blue-50 text-center" style={{ minWidth: '80px', width: '80px' }}>
                      <div className="text-xs space-y-1">
                        <div className="text-gray-600">Allocated: {calculateSprintAllocated('android', sprint.id) || 0}</div>
                        <div className="text-gray-600">Capacity: {getSprintCapacity('android', sprint.id) || 0}</div>
                        <div className={`font-semibold ${
                          calculateSprintBalance('android', sprint.id) < 0 ? 'text-red-600' : 
                          calculateSprintBalance('android', sprint.id) > 0 ? 'text-green-600' : 
                          'text-gray-900'
                        }`}>
                          Balance: {calculateSprintBalance('android', sprint.id)}
                        </div>
                      </div>
                    </td>
                  ))}
                  
                  {/* iOS Sprint Footers */}
                  {iosSprints.map((sprint) => (
                    <td key={`ios_footer_${sprint.id}`} className="px-2 py-2 border-r border-gray-200 bg-orange-50 text-center" style={{ minWidth: '80px', width: '80px' }}>
                      <div className="text-xs space-y-1">
                        <div className="text-gray-600">Allocated: {calculateSprintAllocated('ios', sprint.id) || 0}</div>
                        <div className="text-gray-600">Capacity: {getSprintCapacity('ios', sprint.id) || 0}</div>
                        <div className={`font-semibold ${
                          calculateSprintBalance('ios', sprint.id) < 0 ? 'text-red-600' : 
                          calculateSprintBalance('ios', sprint.id) > 0 ? 'text-green-600' : 
                          'text-gray-900'
                        }`}>
                          Balance: {calculateSprintBalance('ios', sprint.id)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resource Planning Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Resource Planning</h2>
          <p className="text-gray-600">
            Manage sprint capacities and track resource balance
          </p>
        </div>

        {/* Sprint Capacity Tables - 3 columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SprintTable
            title="Backend Sprints"
            sprints={backendSprints}
            type="backend"
            onSprintChange={handleSprintChange}
            onAddSprint={handleAddSprint}
            onDeleteSprint={handleDeleteSprint}
            formatNumber={formatNumber}
          />
          <SprintTable
            title="Android Sprints"
            sprints={androidSprints}
            type="android"
            onSprintChange={handleSprintChange}
            onAddSprint={handleAddSprint}
            onDeleteSprint={handleDeleteSprint}
            formatNumber={formatNumber}
          />
          <SprintTable
            title="iOS Sprints"
            sprints={iosSprints}
            type="ios"
            onSprintChange={handleSprintChange}
            onAddSprint={handleAddSprint}
            onDeleteSprint={handleDeleteSprint}
            formatNumber={formatNumber}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

