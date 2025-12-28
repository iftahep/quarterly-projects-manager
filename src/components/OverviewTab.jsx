import React, { useState, useEffect } from 'react'
import GanttModal from './GanttModal'
import { useTheme } from '../contexts/ThemeContext'

// SprintTable component - defined outside to prevent re-creation on each render
const SprintTable = React.memo(({ title, sprints, type, onSprintChange, onAddSprint, onDeleteSprint, formatNumber, isTableLocked = false }) => {
  const { theme } = useTheme()
  const bgCard = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderCard = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const bgHeader = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'
  const textTitle = theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
  const divideColor = theme === 'dark' ? 'divide-slate-700' : 'divide-gray-200'
  const bgTable = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const textHeader = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const hoverRow = theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
  const bgInput = theme === 'dark' ? 'bg-slate-700' : 'bg-white'
  const borderInput = theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
  const textInput = theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
  const textIcon = theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const bgDisabled = theme === 'dark' ? 'bg-slate-600' : 'bg-slate-400'
  const textDisabled = theme === 'dark' ? 'text-slate-400' : 'text-slate-200'
  
  return (
    <div className={`${bgCard} rounded-lg shadow-sm border ${borderCard} overflow-hidden`}>
      <div className={`px-2 py-1 ${bgHeader} border-b ${borderCard} flex justify-between items-center`}>
        <h3 className={`text-sm font-semibold ${textTitle}`}>{title}</h3>
        <button
          onClick={() => onAddSprint(type)}
          disabled={isTableLocked}
          className={`px-2 py-1 text-xs rounded transition-colors ${isTableLocked ? `${bgDisabled} ${textDisabled} cursor-not-allowed` : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          + Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${divideColor}`}>
          <thead className={bgTable}>
            <tr>
              <th className={`px-2 py-1 text-left text-xs font-medium ${textHeader} uppercase tracking-wider`}>
                Sprint Name
              </th>
              <th className={`px-2 py-1 text-center text-xs font-medium ${textHeader} uppercase tracking-wider`}>
                Capacity
              </th>
              <th className={`px-2 py-1 text-center text-xs font-medium ${textHeader} uppercase tracking-wider w-16`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className={`${bgTable} divide-y ${divideColor}`}>
            {sprints.map((sprint) => (
              <tr key={sprint.id} className={`group ${hoverRow} transition-colors`}>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    value={sprint.name || ''}
                    onChange={(e) => onSprintChange(type, sprint.id, 'name', e.target.value)}
                    disabled={isTableLocked}
                    className={`w-full h-6 py-0 px-1 text-xs leading-none ${bgInput} border ${borderInput} ${textInput} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isTableLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                    placeholder="Sprint name"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={formatNumber(sprint.capacity)}
                    onChange={(e) => onSprintChange(type, sprint.id, 'capacity', e.target.value)}
                    disabled={isTableLocked}
                    className={`w-full h-6 py-0 px-1 text-xs leading-none ${bgInput} border ${borderInput} ${textInput} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center ${isTableLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => onDeleteSprint(type, sprint.id)}
                    disabled={isTableLocked}
                    className={`p-1.5 transition-colors opacity-0 group-hover:opacity-100 ${isTableLocked ? `${theme === 'dark' ? 'text-slate-600' : 'text-gray-300'} cursor-not-allowed` : `${textIcon} hover:text-red-400`}`}
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
  )
})

const OWNER_OPTIONS = ['Oren', 'Shchory', 'Bar', 'Ben', 'Ohad', 'Ronen', 'Jenny', 'Aharoni', 'Rick']
const TECH_OWNER_OPTIONS = ['Vitaly', 'Stas', 'Semyon', 'Dzimtry', 'Kirill', 'Shalom', 'Aharoni', 'Jenny']

function OverviewTab({
  projects,
  backendSprints,
  androidSprints,
  iosSprints,
  showBackendSprints,
  showAndroidSprints,
  showIosSprints,
  setShowBackendSprints,
  setShowAndroidSprints,
  setShowIosSprints,
  handleAddRow,
  handleCellChange,
  handleMoveProject,
  handleDeleteRow,
  formatNumber,
  calculateTotal,
  calculateProjectAllocated,
  calculateProjectBalance,
  calculateSprintAllocated,
  calculateSprintBalance,
  getSprintCapacity,
  handleSprintChange,
  handleAddSprint,
  handleDeleteSprint,
  showGanttModal,
  setShowGanttModal,
  isTableLocked = false,
  baselineData = null,
  showDiff = false
}) {
  const { theme } = useTheme()
  const [showOwners, setShowOwners] = useState(false)

  // Helper functions for diff visualization
  const getBaselineValue = (projectId, field) => {
    if (!baselineData || !baselineData.projects) {
      return null
    }
    const baselineProject = baselineData.projects.find(p => p.id === projectId)
    const value = baselineProject ? baselineProject[field] : null
    if (showDiff && value !== null) {
      console.log(`getBaselineValue - projectId: ${projectId}, field: ${field}, value: ${value}`)
    }
    return value
  }

  const isProjectNew = (projectId) => {
    if (!baselineData || !baselineData.projects) return true
    return !baselineData.projects.find(p => p.id === projectId)
  }

  const hasValueChanged = (currentValue, baselineValue) => {
    if (baselineValue === null || baselineValue === undefined) {
      if (showDiff) {
        console.log('hasValueChanged - no baseline value:', { currentValue, baselineValue })
      }
      return false
    }
    const current = parseFloat(currentValue) || 0
    const baseline = parseFloat(baselineValue) || 0
    const changed = current !== baseline
    if (showDiff && changed) {
      console.log('hasValueChanged - VALUE CHANGED:', { current, baseline, changed })
    }
    return changed
  }

  // Debug: Log when showDiff or baselineData changes
  useEffect(() => {
    console.log('=== OverviewTab Debug ===')
    console.log('showDiff:', showDiff)
    console.log('baselineData exists:', !!baselineData)
    console.log('baselineData projects count:', baselineData?.projects?.length || 0)
    console.log('current projects count:', projects?.length || 0)
    
    if (showDiff && baselineData && baselineData.projects) {
      console.log('=== Comparing Projects ===')
      projects.forEach((project, index) => {
        const baselineProject = baselineData.projects.find(p => p.id === project.id)
        if (baselineProject) {
          const backendChanged = (parseFloat(project.backend) || 0) !== (parseFloat(baselineProject.backend) || 0)
          console.log(`Project ${index} (${project.epic}): id=${project.id}, backend=${project.backend}, baseline=${baselineProject.backend}, changed=${backendChanged}`)
        } else {
          console.log(`Project ${index} (${project.epic}): id=${project.id}, NOT FOUND IN BASELINE (NEW PROJECT)`)
        }
      })
    }
  }, [showDiff, baselineData, projects])

  // Wrapper function to prevent changes when locked
  const safeHandleCellChange = (id, field, value) => {
    if (isTableLocked) {
      console.warn('Cell change blocked - table is locked')
      return
    }
    handleCellChange(id, field, value)
  }

  // Theme-based classes
  const textTitle = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const textSubtitle = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const textLabel = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const bgCard = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderCard = theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
  const bgTable = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const bgTableHeader = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
  const textTableHeader = theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
  const borderTable = theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
  const bgRowEven = theme === 'dark' ? 'bg-slate-700/30' : '' // No zebra striping in light mode
  const bgRowHover = theme === 'dark' ? 'bg-slate-700/50' : 'hover:bg-slate-50'
  const bgInput = theme === 'dark' ? 'bg-slate-700' : 'bg-white'
  const textInput = theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
  const borderInput = theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
  const hoverInput = theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-slate-50'
  const focusInput = theme === 'dark' ? 'focus:bg-slate-600 focus:ring-2 focus:ring-slate-500' : 'focus:ring-2 focus:ring-indigo-500 focus:bg-transparent'
  const placeholderInput = theme === 'dark' ? 'placeholder:text-slate-600' : 'placeholder:text-slate-400'
  const bgBackend = theme === 'dark' ? 'bg-emerald-900/30' : 'bg-green-100'
  const bgAndroid = theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
  const bgIos = theme === 'dark' ? 'bg-amber-900/30' : 'bg-orange-100'
  const bgDiff = theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-50'
  const textDiff = theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'
  const textTable = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const textTableSecondary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const bgFooter = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const textFooter = theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
  const borderFooter = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const bgToggle = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderToggle = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const textToggle = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const bgCheckbox = theme === 'dark' ? 'bg-slate-700' : 'bg-white'
  const borderCheckbox = theme === 'dark' ? 'border-slate-600' : 'border-slate-200'

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${textTitle} mb-2`}>Projects Table</h2>
          <p className={textSubtitle}>
            Manage quarterly projects and effort estimation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOwners}
              onChange={(e) => setShowOwners(e.target.checked)}
              className={`w-4 h-4 text-blue-600 ${borderCheckbox} rounded focus:ring-blue-500 ${bgCheckbox}`}
            />
            <span className={`text-sm ${textLabel}`}>Show Owners</span>
          </label>
          <button
            onClick={() => setShowGanttModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Show Gantt
          </button>
        </div>
      </div>

      <div className={`${bgCard} rounded-lg shadow-sm border ${borderCard} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={bgTableHeader}>
              <tr>
                <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-left text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border border-[0.5px] ${borderTable}`} style={{ minWidth: '300px', width: '300px' }}>
                  Epic
                </th>
                {showOwners && (
                  <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-left text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}>
                    Owner
                  </th>
                )}
                {showOwners && (
                  <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-left text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}>
                    Tech Owner
                  </th>
                )}
                {/* Backend Team Columns */}
                <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-center text-[11px] font-medium ${textTableHeader} uppercase tracking-wider ${bgBackend} border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  Backend
                </th>
                <th className={`${bgBackend} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  Backend Allocated
                </th>
                <th className={`${bgBackend} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  Backend Balance
                </th>
                
                {/* Android Team Columns */}
                <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-center text-[11px] font-medium ${textTableHeader} uppercase tracking-wider ${bgAndroid} border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  Android
                </th>
                <th className={`${bgAndroid} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  Android Allocated
                </th>
                <th className={`${bgAndroid} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  Android Balance
                </th>
                
                {/* iOS Team Columns */}
                <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-center text-[11px] font-medium ${textTableHeader} uppercase tracking-wider ${bgIos} border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  iOS
                </th>
                <th className={`${bgIos} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  iOS Allocated
                </th>
                <th className={`${bgIos} text-center text-xs font-medium ${textTableHeader} uppercase tracking-wider border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-1.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                  iOS Balance
                </th>
              </tr>
            </thead>
            <tbody className={bgTable}>
              {projects.map((project, index) => (
                <tr key={project.id} className={`group ${bgRowEven} ${bgRowHover} transition-colors border-[0.5px] ${borderTable}`}>
                  {/* Epic - Text Input with Move Buttons */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} relative border border-[0.5px] ${borderTable}`} style={{ minWidth: '300px', width: '300px' }}>
                    <div className="flex items-center">
                      <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 z-10">
                        <button
                          onClick={() => handleMoveProject(project.id, 'up')}
                          disabled={index === 0 || isTableLocked}
                          className={`p-0.5 ${index === 0 || isTableLocked 
                            ? (theme === 'dark' ? 'text-slate-600' : 'text-gray-400') + ' cursor-not-allowed' 
                            : (theme === 'dark' ? 'text-slate-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600')
                          }`}
                          title="Move up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveProject(project.id, 'down')}
                          disabled={index === projects.length - 1 || isTableLocked}
                          className={`p-0.5 ${index === projects.length - 1 || isTableLocked 
                            ? (theme === 'dark' ? 'text-slate-600' : 'text-gray-400') + ' cursor-not-allowed' 
                            : (theme === 'dark' ? 'text-slate-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600')
                          }`}
                          title="Move down"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteRow(project.id)}
                        disabled={isTableLocked}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 ${isTableLocked 
                          ? (theme === 'dark' ? 'text-slate-600' : 'text-slate-400') + ' cursor-not-allowed' 
                          : (theme === 'dark' ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-600')
                        }`}
                        title="Delete row"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={project.epic}
                        onChange={(e) => safeHandleCellChange(project.id, 'epic', e.target.value)}
                        disabled={isTableLocked}
                        readOnly={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 pr-8 text-[11px] leading-none ${bgInput} ${textInput} ${theme === 'dark' ? 'border-0' : 'border-0'} ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${hoverInput} ${focusInput}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : 'focus:ring-2 focus:ring-indigo-500'}`}
                        placeholder="Enter epic name"
                        style={{ paddingLeft: '20px' }}
                      />
                    </div>
                  </td>
                  
                  {/* Owner - Select Dropdown */}
                  {showOwners && (
                    <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}>
                      <select
                        value={project.owner}
                        onChange={(e) => safeHandleCellChange(project.id, 'owner', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none ${bgInput} ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${hoverInput} ${focusInput}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : 'focus:ring-2 focus:ring-indigo-500'} appearance-none cursor-pointer`}
                      >
                        <option value="" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Select Owner</option>
                        {OWNER_OPTIONS.map((owner) => (
                          <option key={owner} value={owner} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                            {owner}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  
                  {/* Tech Owner - Select Dropdown */}
                  {showOwners && (
                    <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}>
                      <select
                        value={project.techOwner}
                        onChange={(e) => safeHandleCellChange(project.id, 'techOwner', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none ${bgInput} ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${hoverInput} ${focusInput}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : 'focus:ring-2 focus:ring-indigo-500'} appearance-none cursor-pointer`}
                      >
                        <option value="" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Select Tech Owner</option>
                        {TECH_OWNER_OPTIONS.map((techOwner) => (
                          <option key={techOwner} value={techOwner} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                            {techOwner}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  
                  {/* Backend Team Columns */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable} ${showDiff && hasValueChanged(project.backend, getBaselineValue(project.id, 'backend')) ? bgDiff : bgBackend}`} style={{ minWidth: '90px', width: '90px' }}>
                    <div className="flex flex-col">
                      <input
                        type="number"
                        value={(() => {
                          const val = formatNumber(project.backend)
                          const num = parseFloat(val)
                          return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                        })()}
                        onChange={(e) => safeHandleCellChange(project.id, 'backend', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-600/50 focus:bg-slate-600/50' : 'hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500'}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : ''} text-center ${placeholderInput}`}
                        placeholder="0"
                        min="0"
                        step="0.5"
                      />
                      {showDiff && hasValueChanged(project.backend, getBaselineValue(project.id, 'backend')) && (
                        <span className={`text-[9px] ${textDiff} line-through px-1`}>
                          Was: {formatNumber(getBaselineValue(project.id, 'backend')) || '0'}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className={`${bgBackend} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    {calculateProjectAllocated(project, 'backend') || 0}
                  </td>
                  
                  <td className={`${bgBackend} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`${
                      calculateProjectBalance(project, 'backend') < 0 ? 'text-red-400' : 
                      calculateProjectBalance(project, 'backend') > 0 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {calculateProjectBalance(project, 'backend')}
                    </span>
                  </td>
                  
                  {/* Android Team Columns */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable} ${showDiff && hasValueChanged(project.android, getBaselineValue(project.id, 'android')) ? bgDiff : bgAndroid}`} style={{ minWidth: '90px', width: '90px' }}>
                    <div className="flex flex-col">
                      <input
                        type="number"
                        value={(() => {
                          const val = formatNumber(project.android)
                          const num = parseFloat(val)
                          return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                        })()}
                        onChange={(e) => safeHandleCellChange(project.id, 'android', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-600/50 focus:bg-slate-600/50' : 'hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500'}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : ''} text-center ${placeholderInput}`}
                        placeholder="0"
                        min="0"
                        step="0.5"
                      />
                      {showDiff && hasValueChanged(project.android, getBaselineValue(project.id, 'android')) && (
                        <span className={`text-[9px] ${textDiff} line-through px-1`}>
                          Was: {formatNumber(getBaselineValue(project.id, 'android')) || '0'}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className={`${bgAndroid} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    {calculateProjectAllocated(project, 'android') || 0}
                  </td>
                  
                  <td className={`${bgAndroid} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`${
                      calculateProjectBalance(project, 'android') < 0 ? 'text-red-400' : 
                      calculateProjectBalance(project, 'android') > 0 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {calculateProjectBalance(project, 'android')}
                    </span>
                  </td>
                  
                  {/* iOS Team Columns */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable} ${showDiff && hasValueChanged(project.ios, getBaselineValue(project.id, 'ios')) ? bgDiff : bgIos}`} style={{ minWidth: '90px', width: '90px' }}>
                    <div className="flex flex-col">
                      <input
                        type="number"
                        value={(() => {
                          const val = formatNumber(project.ios)
                          const num = parseFloat(val)
                          return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                        })()}
                        onChange={(e) => safeHandleCellChange(project.id, 'ios', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-600/50 focus:bg-slate-600/50' : 'hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500'}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : ''} text-center ${placeholderInput}`}
                        placeholder="0"
                        min="0"
                        step="0.5"
                      />
                      {showDiff && hasValueChanged(project.ios, getBaselineValue(project.id, 'ios')) && (
                        <span className={`text-[9px] ${textDiff} line-through px-1`}>
                          Was: {formatNumber(getBaselineValue(project.id, 'ios')) || '0'}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className={`${bgIos} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    {calculateProjectAllocated(project, 'ios') || 0}
                  </td>
                  
                  <td className={`${bgIos} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'}`} style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`${
                      calculateProjectBalance(project, 'ios') < 0 ? 'text-red-400' : 
                      calculateProjectBalance(project, 'ios') > 0 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {calculateProjectBalance(project, 'ios')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Summary Row - Require */}
              <tr className={`${bgFooter} font-bold border-t-[0.5px] ${borderFooter} shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]`}>
                <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} sticky bottom-0 ${bgFooter} z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '300px', width: '300px' }}>
                  <span className={`text-[11px] ${textFooter} px-1`}>Require</span>
                </td>
                {showOwners && (
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} sticky bottom-0 ${bgFooter} z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}></td>
                )}
                {showOwners && (
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} sticky bottom-0 ${bgFooter} z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '120px', width: '120px' }}></td>
                )}
                
                {/* Backend Team Summary */}
                <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} ${bgBackend} text-center sticky bottom-0 z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  <span className={`text-[11px] ${textTableSecondary}`}>{calculateTotal('backend') || 0}</span>
                </td>
                <td className={`${bgBackend} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'backend'), 0) || 0}
                </td>
                <td className={`${bgBackend} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  <span className={`${
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'backend'), 0) < 0 ? 'text-red-400' : 
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'backend'), 0) > 0 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'backend'), 0) || 0}
                  </span>
                </td>
                
                {/* Android Team Summary */}
                <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} ${bgAndroid} text-center sticky bottom-0 z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  <span className={`text-[11px] ${textTableSecondary}`}>{calculateTotal('android') || 0}</span>
                </td>
                <td className={`${bgAndroid} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'android'), 0) || 0}
                </td>
                <td className={`${bgAndroid} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  <span className={`${
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'android'), 0) < 0 ? 'text-red-400' : 
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'android'), 0) > 0 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'android'), 0) || 0}
                  </span>
                </td>
                
                {/* iOS Team Summary */}
                <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} ${bgIos} text-center sticky bottom-0 z-30 border border-[0.5px] ${borderTable}`} style={{ minWidth: '90px', width: '90px' }}>
                  <span className={`text-[11px] ${textTableSecondary}`}>{calculateTotal('ios') || 0}</span>
                </td>
                <td className={`${bgIos} text-center text-xs ${textTable} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'ios'), 0) || 0}
                </td>
                <td className={`${bgIos} text-center text-xs font-bold border-r-4 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} ${theme === 'dark' ? 'px-2 py-1' : 'px-2 py-0.5'} sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  <span className={`${
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'ios'), 0) < 0 ? 'text-red-400' : 
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'ios'), 0) > 0 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'ios'), 0) || 0}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={handleAddRow}
            disabled={isTableLocked}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${isTableLocked 
              ? (theme === 'dark' ? 'bg-slate-600 text-slate-400' : 'bg-gray-400 text-gray-200') + ' cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
            title="Add New Project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance Summary Table - Above Resource Planning */}
      <div className={`${bgCard} rounded-lg shadow-sm border ${borderCard} overflow-hidden`}>
        <div className={`px-2 py-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'} border-b ${borderCard}`}>
          <h3 className={`text-lg font-semibold ${textTitle}`}>Balance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-gray-200'}`}>
            <thead className={bgTableHeader}>
              <tr>
                <th className={`px-2 py-1 text-left text-xs font-semibold ${textTableHeader} uppercase tracking-wider border-r ${borderTable}`}>
                  Metric
                </th>
                <th className={`px-2 py-1 text-center text-xs font-semibold ${textTableHeader} uppercase tracking-wider border-r ${borderTable}`}>
                  Backend
                </th>
                <th className={`px-2 py-1 text-center text-xs font-semibold ${textTableHeader} uppercase tracking-wider border-r ${borderTable}`}>
                  Android
                </th>
                <th className={`px-2 py-1 text-center text-xs font-semibold ${textTableHeader} uppercase tracking-wider`}>
                  iOS
                </th>
              </tr>
            </thead>
            <tbody className={`${bgTable} ${theme === 'dark' ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {/* Require Row */}
              <tr className={theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'}>
                <td className={`px-2 py-1 border-r ${borderTable}`}>
                  <span className={`text-xs font-medium ${textTable}`}>Require</span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs ${textTableSecondary}`}>{calculateTotal('backend') || 0}</span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs ${textTableSecondary}`}>{calculateTotal('android') || 0}</span>
                </td>
                <td className="px-2 py-1 text-center">
                  <span className={`text-xs ${textTableSecondary}`}>{calculateTotal('ios') || 0}</span>
                </td>
              </tr>
              
              {/* Capacity Row - Calculated from Sprint Tables */}
              <tr className={theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'}>
                <td className={`px-2 py-1 border-r ${borderTable}`}>
                  <span className={`text-xs font-medium ${textTable}`}>Capacity</span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs ${textTableSecondary}`}>{backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs ${textTableSecondary}`}>{androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
                <td className="px-2 py-1 text-center">
                  <span className={`text-xs ${textTableSecondary}`}>{iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
              </tr>
              
              {/* Balance Row */}
              <tr className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} font-semibold border-t-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                <td className={`px-2 py-1 border-r ${borderTable}`}>
                  <span className={`text-xs font-semibold ${textFooter}`}>Balance</span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs font-semibold ${
                    (backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')) < 0 ? 'text-red-400' : 
                    (backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')) > 0 ? 'text-green-400' : 
                    textTableSecondary
                  }`}>
                    {backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')}
                  </span>
                </td>
                <td className={`px-2 py-1 border-r ${borderTable} text-center`}>
                  <span className={`text-xs font-semibold ${
                    (androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')) < 0 ? 'text-red-400' : 
                    (androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')) > 0 ? 'text-green-400' : 
                    textTableSecondary
                  }`}>
                    {androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')}
                  </span>
                </td>
                <td className="px-2 py-1 text-center">
                  <span className={`text-xs font-semibold ${
                    (iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('ios')) < 0 ? 'text-red-400' : 
                    (iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('ios')) > 0 ? 'text-green-400' : 
                    textTableSecondary
                  }`}>
                    {iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('ios')}
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
          <h2 className={`text-3xl font-bold ${textTitle} mb-2`}>Sprint Allocation</h2>
          <p className={textSubtitle}>
            Allocate effort to specific sprints for each project
          </p>
        </div>

        {/* Toggle Controls */}
        <div className={`flex items-center gap-4 p-4 ${bgToggle} rounded-lg border ${borderToggle}`}>
          <span className={`text-sm font-medium ${textToggle}`}>Show Columns:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBackendSprints}
              onChange={(e) => setShowBackendSprints(e.target.checked)}
              className={`w-4 h-4 text-green-600 ${borderCheckbox} rounded focus:ring-green-500 ${bgCheckbox}`}
            />
            <span className={`text-sm ${textToggle}`}>Backend</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAndroidSprints}
              onChange={(e) => setShowAndroidSprints(e.target.checked)}
              className={`w-4 h-4 text-blue-600 ${borderCheckbox} rounded focus:ring-blue-500 ${bgCheckbox}`}
            />
            <span className={`text-sm ${textToggle}`}>Android</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIosSprints}
              onChange={(e) => setShowIosSprints(e.target.checked)}
              className={`w-4 h-4 text-orange-600 ${borderCheckbox} rounded focus:ring-orange-500 ${bgCheckbox}`}
            />
            <span className={`text-sm ${textToggle}`}>iOS</span>
          </label>
        </div>

        <div className={`${bgCard} rounded-lg shadow-sm border ${borderCard} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ minWidth: '1200px' }}>
              <thead className={bgTableHeader}>
                {/* Super Headers Row - Team Grouping */}
                <tr>
                  <th className={`p-0 border-r-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} sticky top-0 left-0 ${bgTableHeader} z-30 border-[0.5px] ${borderTable}`} style={{ minWidth: '250px', width: '250px' }}>
                    {/* Empty cell for Epic column */}
                  </th>
                  {showBackendSprints && (
                    <th 
                      colSpan={backendSprints.length}
                      className={`p-0 ${theme === 'dark' ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700' : 'bg-green-200 text-green-800 border-green-300'} text-center font-bold border-b sticky top-0 z-30 text-[11px] border-[0.5px] ${borderTable}`}
                    >
                      Backend Team Sprints
                    </th>
                  )}
                  {showAndroidSprints && (
                    <th 
                      colSpan={androidSprints.length}
                      className={`p-0 ${theme === 'dark' ? 'bg-blue-900/50 text-blue-200 border-blue-700' : 'bg-blue-200 text-blue-800 border-blue-300'} text-center font-bold border-b sticky top-0 z-30 text-[11px] border-[0.5px] ${borderTable}`}
                    >
                      Android Team Sprints
                    </th>
                  )}
                  {showIosSprints && (
                    <th 
                      colSpan={iosSprints.length}
                      className={`p-0 ${theme === 'dark' ? 'bg-amber-900/50 text-amber-200 border-amber-700' : 'bg-orange-200 text-orange-800 border-orange-300'} text-center font-bold border-b sticky top-0 z-30 text-[11px] border-[0.5px] ${borderTable}`}
                    >
                      iOS Team Sprints
                    </th>
                  )}
                </tr>
                
                {/* Sprint Names Row */}
                <tr>
                  <th className={`p-0 text-left text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border-r-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} sticky top-[20px] left-0 ${bgTableHeader} z-20 border-[0.5px] ${borderTable}`} style={{ minWidth: '250px', width: '250px' }}>
                    <span className="px-1">Epic</span>
                  </th>
                  
                  {/* Backend Sprint Columns */}
                  {showBackendSprints && backendSprints.map((sprint, index) => {
                    const balance = calculateSprintBalance('backend', sprint.id)
                    const isNegative = balance < 0
                    const isLastInGroup = index === backendSprints.length - 1
                    const shouldShowBorder = isLastInGroup && (showAndroidSprints || showIosSprints)
                    return (
                      <th
                        key={`backend_${sprint.id}`}
                        className={`p-0 text-center ${
                          shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''
                        } ${isNegative ? (theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50') : bgTableHeader} sticky top-[20px] z-20 border-[0.5px] ${borderTable}`}
                        title={sprint.name || 'Unnamed Sprint'}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col gap-0">
                          <div className={`text-[11px] font-medium ${textTable} uppercase tracking-wider`}>
                            {sprint.name || 'Sprint'}
                          </div>
                          <div className={`text-[11px] font-semibold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                            Bal: {balance}
                          </div>
                        </div>
                      </th>
                    )
                  })}
                  
                  {/* Android Sprint Columns */}
                  {showAndroidSprints && androidSprints.map((sprint, index) => {
                    const balance = calculateSprintBalance('android', sprint.id)
                    const isNegative = balance < 0
                    const isLastInGroup = index === androidSprints.length - 1
                    const shouldShowBorder = isLastInGroup && showIosSprints
                    return (
                      <th
                        key={`android_${sprint.id}`}
                        className={`p-0 text-center ${
                          shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''
                        } ${isNegative ? (theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50') : bgTableHeader} sticky top-[20px] z-20 border-[0.5px] ${borderTable}`}
                        title={sprint.name || 'Unnamed Sprint'}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col gap-0">
                          <div className={`text-[11px] font-medium ${textTable} uppercase tracking-wider`}>
                            {sprint.name || 'Sprint'}
                          </div>
                          <div className={`text-[11px] font-semibold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                            Bal: {balance}
                          </div>
                        </div>
                      </th>
                    )
                  })}
                  
                  {/* iOS Sprint Columns */}
                  {showIosSprints && iosSprints.map((sprint) => {
                    const balance = calculateSprintBalance('ios', sprint.id)
                    const isNegative = balance < 0
                    return (
                      <th
                        key={`ios_${sprint.id}`}
                        className={`p-0 text-center ${isNegative ? (theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50') : bgTableHeader} sticky top-[20px] z-20 border-[0.5px] ${borderTable}`}
                        title={sprint.name || 'Unnamed Sprint'}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col gap-0">
                          <div className={`text-[11px] font-medium ${textTable} uppercase tracking-wider`}>
                            {sprint.name || 'Sprint'}
                          </div>
                          <div className={`text-[11px] font-semibold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                            Bal: {balance}
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className={bgTable}>
                {projects.map((project, index) => (
                  <tr key={project.id} className={`${index % 2 === 1 ? bgRowEven : ''} ${bgRowHover} transition-colors border-[0.5px] ${borderTable}`}>
                    <td className={`p-0 border-r-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} sticky left-0 ${bgTable} z-10 border-[0.5px] ${borderTable}`} style={{ minWidth: '250px', width: '250px' }}>
                      <span className={`text-[11px] font-medium ${textTableSecondary} px-1`}>{project.epic || 'Unnamed Epic'}</span>
                    </td>
                    
                    {/* Backend Sprint Columns */}
                    {showBackendSprints && backendSprints.map((sprint, index) => {
                      const value = parseFloat(project[`backend_${sprint.id}`]) || 0
                      const hasValue = value > 0
                      const isLastInGroup = index === backendSprints.length - 1
                      const shouldShowBorder = isLastInGroup && (showAndroidSprints || showIosSprints)
                      return (
                        <td 
                          key={`backend_${sprint.id}`} 
                          className={`p-0 ${shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''} ${showDiff && hasValueChanged(project[`backend_${sprint.id}`], getBaselineValue(project.id, `backend_${sprint.id}`)) ? bgDiff : (hasValue ? bgBackend : '')} border-[0.5px] ${borderTable}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={(() => {
                                const val = formatNumber(project[`backend_${sprint.id}`])
                                const num = parseFloat(val)
                                return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                              })()}
                              onChange={(e) => safeHandleCellChange(project.id, `backend_${sprint.id}`, e.target.value)}
                              disabled={isTableLocked}
                              className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-700/50 focus:bg-slate-700/50' : 'hover:bg-gray-50 focus:bg-slate-100'}`} focus:outline-none focus:ring-0 text-center ${placeholderInput}`}
                              placeholder="0"
                              min="0"
                              step="0.5"
                            />
                            {showDiff && hasValueChanged(project[`backend_${sprint.id}`], getBaselineValue(project.id, `backend_${sprint.id}`)) && (
                              <span className={`text-[9px] ${textDiff} line-through px-1`}>
                                Was: {formatNumber(getBaselineValue(project.id, `backend_${sprint.id}`)) || '0'}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    
                    {/* Android Sprint Columns */}
                    {showAndroidSprints && androidSprints.map((sprint, index) => {
                      const value = parseFloat(project[`android_${sprint.id}`]) || 0
                      const hasValue = value > 0
                      const isLastInGroup = index === androidSprints.length - 1
                      const shouldShowBorder = isLastInGroup && showIosSprints
                      return (
                        <td 
                          key={`android_${sprint.id}`} 
                          className={`p-0 ${shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''} ${showDiff && hasValueChanged(project[`android_${sprint.id}`], getBaselineValue(project.id, `android_${sprint.id}`)) ? bgDiff : (hasValue ? bgAndroid : '')} border-[0.5px] ${borderTable}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={(() => {
                                const val = formatNumber(project[`android_${sprint.id}`])
                                const num = parseFloat(val)
                                return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                              })()}
                              onChange={(e) => safeHandleCellChange(project.id, `android_${sprint.id}`, e.target.value)}
                              disabled={isTableLocked}
                              className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-700/50 focus:bg-slate-700/50' : 'hover:bg-gray-50 focus:bg-slate-100'}`} focus:outline-none focus:ring-0 text-center ${placeholderInput}`}
                              placeholder="0"
                              min="0"
                              step="0.5"
                            />
                            {showDiff && hasValueChanged(project[`android_${sprint.id}`], getBaselineValue(project.id, `android_${sprint.id}`)) && (
                              <span className={`text-[9px] ${textDiff} line-through px-1`}>
                                Was: {formatNumber(getBaselineValue(project.id, `android_${sprint.id}`)) || '0'}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    
                    {/* iOS Sprint Columns */}
                    {showIosSprints && iosSprints.map((sprint) => {
                      const value = parseFloat(project[`ios_${sprint.id}`]) || 0
                      const hasValue = value > 0
                      return (
                        <td 
                          key={`ios_${sprint.id}`} 
                          className={`p-0 ${showDiff && hasValueChanged(project[`ios_${sprint.id}`], getBaselineValue(project.id, `ios_${sprint.id}`)) ? bgDiff : (hasValue ? bgIos : '')} border-[0.5px] ${borderTable}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={(() => {
                                const val = formatNumber(project[`ios_${sprint.id}`])
                                const num = parseFloat(val)
                                return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                              })()}
                              onChange={(e) => safeHandleCellChange(project.id, `ios_${sprint.id}`, e.target.value)}
                              disabled={isTableLocked}
                              className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${theme === 'dark' ? 'hover:bg-slate-700/50 focus:bg-slate-700/50' : 'hover:bg-gray-50 focus:bg-slate-100'}`} focus:outline-none focus:ring-0 text-center ${placeholderInput}`}
                              placeholder="0"
                              min="0"
                              step="0.5"
                            />
                            {showDiff && hasValueChanged(project[`ios_${sprint.id}`], getBaselineValue(project.id, `ios_${sprint.id}`)) && (
                              <span className={`text-[9px] ${textDiff} line-through px-1`}>
                                Was: {formatNumber(getBaselineValue(project.id, `ios_${sprint.id}`)) || '0'}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 z-20">
                {/* Summary Row with Footers */}
                <tr className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} font-bold border-t-4 border-double ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                  <td 
                    colSpan={1}
                    className={`p-0 border-r-2 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} sticky bottom-0 left-0 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} z-40 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] border-[0.5px] ${borderTable} text-right`}
                    style={{ minWidth: '250px', width: '250px' }}
                  >
                    <div className="flex flex-col items-end space-y-0 px-1 h-6 justify-center">
                      <span className={`text-[11px] ${textTableHeader}`}>Allocated</span>
                      <span className={`text-[11px] ${textTableHeader}`}>Capacity</span>
                      <span className={`text-[11px] font-bold ${textFooter}`}>Balance</span>
                    </div>
                  </td>
                  
                  {/* Backend Sprint Footers */}
                  {showBackendSprints && backendSprints.map((sprint, index) => {
                    const allocated = calculateSprintAllocated('backend', sprint.id) || 0
                    const capacity = getSprintCapacity('backend', sprint.id) || 0
                    const balance = calculateSprintBalance('backend', sprint.id)
                    const hasValue = allocated > 0
                    const isLastInGroup = index === backendSprints.length - 1
                    const shouldShowBorder = isLastInGroup && (showAndroidSprints || showIosSprints)
                    return (
                      <td 
                        key={`backend_footer_${sprint.id}`} 
                        className={`p-0 ${shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''} text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} sticky bottom-0 z-30 border-[0.5px] ${borderTable} h-6`}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col space-y-0 h-full justify-center">
                          <div className={`text-[11px] ${textTableHeader}`}>{allocated}</div>
                          <div className={`text-[11px] ${textTableHeader}`}>{capacity}</div>
                          <div className={`border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} my-0`}></div>
                          <div className={`text-[11px] font-bold ${
                            balance < 0 ? 'text-red-400' : 
                            balance > 0 ? 'text-green-400' : 
                            textFooter
                          }`}>
                            {balance}
                          </div>
                        </div>
                      </td>
                    )
                  })}
                  
                  {/* Android Sprint Footers */}
                  {showAndroidSprints && androidSprints.map((sprint, index) => {
                    const allocated = calculateSprintAllocated('android', sprint.id) || 0
                    const capacity = getSprintCapacity('android', sprint.id) || 0
                    const balance = calculateSprintBalance('android', sprint.id)
                    const hasValue = allocated > 0
                    const isLastInGroup = index === androidSprints.length - 1
                    const shouldShowBorder = isLastInGroup && showIosSprints
                    return (
                      <td 
                        key={`android_footer_${sprint.id}`} 
                        className={`p-0 ${shouldShowBorder ? `border-r-4 ${theme === 'dark' ? 'border-slate-500' : 'border-slate-300'}` : ''} text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} sticky bottom-0 z-30 border-[0.5px] ${borderTable} h-6`}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col space-y-0 h-full justify-center">
                          <div className={`text-[11px] ${textTableHeader}`}>{allocated}</div>
                          <div className={`text-[11px] ${textTableHeader}`}>{capacity}</div>
                          <div className={`border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} my-0`}></div>
                          <div className={`text-[11px] font-bold ${
                            balance < 0 ? 'text-red-400' : 
                            balance > 0 ? 'text-green-400' : 
                            textFooter
                          }`}>
                            {balance}
                          </div>
                        </div>
                      </td>
                    )
                  })}
                  
                  {/* iOS Sprint Footers */}
                  {showIosSprints && iosSprints.map((sprint) => {
                    const allocated = calculateSprintAllocated('ios', sprint.id) || 0
                    const capacity = getSprintCapacity('ios', sprint.id) || 0
                    const balance = calculateSprintBalance('ios', sprint.id)
                    const hasValue = allocated > 0
                    return (
                      <td 
                        key={`ios_footer_${sprint.id}`} 
                        className={`p-0 text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'} sticky bottom-0 z-30 border-[0.5px] ${borderTable} h-6`}
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col space-y-0 h-full justify-center">
                          <div className={`text-[11px] ${textTableHeader}`}>{allocated}</div>
                          <div className={`text-[11px] ${textTableHeader}`}>{capacity}</div>
                          <div className={`border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} my-0`}></div>
                          <div className={`text-[11px] font-bold ${
                            balance < 0 ? 'text-red-400' : 
                            balance > 0 ? 'text-green-400' : 
                            textFooter
                          }`}>
                            {balance}
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Resource Planning Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Resource Planning</h2>
          <p className="text-slate-400">
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
            isTableLocked={isTableLocked}
          />
          <SprintTable
            title="Android Sprints"
            sprints={androidSprints}
            type="android"
            onSprintChange={handleSprintChange}
            onAddSprint={handleAddSprint}
            onDeleteSprint={handleDeleteSprint}
            formatNumber={formatNumber}
            isTableLocked={isTableLocked}
          />
          <SprintTable
            title="iOS Sprints"
            sprints={iosSprints}
            type="ios"
            onSprintChange={handleSprintChange}
            onAddSprint={handleAddSprint}
            onDeleteSprint={handleDeleteSprint}
            formatNumber={formatNumber}
            isTableLocked={isTableLocked}
          />
        </div>
      </div>

      {/* Gantt Chart Modal */}
      <GanttModal
        isOpen={showGanttModal}
        onClose={() => setShowGanttModal(false)}
        projects={projects}
        backendSprints={backendSprints}
        androidSprints={androidSprints}
        iosSprints={iosSprints}
      />
    </div>
  )
}

export default OverviewTab

