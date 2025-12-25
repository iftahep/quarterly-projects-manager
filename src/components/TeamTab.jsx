import React, { useState } from 'react'

const OWNER_OPTIONS = ['Oren', 'Shchory', 'Bar', 'Ben', 'Ohad', 'Ronen', 'Jenny', 'Aharoni', 'Rick']
const TECH_OWNER_OPTIONS = ['Vitaly', 'Stas', 'Semyon', 'Dzimtry', 'Kirill', 'Shalom', 'Aharoni', 'Jenny']

function TeamTab({
  team,
  projects,
  sprints,
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
  isTableLocked = false,
  baselineData = null,
  showDiff = false
}) {
  // Team-specific styling
  const teamConfig = {
    backend: {
      label: 'Backend',
      bgColor: 'bg-green-100', // For Effort, Allocated, Balance columns
      bgColorSprint: 'bg-green-200', // For Sprint columns
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    },
    android: {
      label: 'Android',
      bgColor: 'bg-blue-100', // For Effort, Allocated, Balance columns
      bgColorSprint: 'bg-blue-200', // For Sprint columns
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300'
    },
    ios: {
      label: 'iOS',
      bgColor: 'bg-orange-100', // For Effort, Allocated, Balance columns
      bgColorSprint: 'bg-orange-200', // For Sprint columns
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300'
    }
  }

  const config = teamConfig[team]
  const [showOwners, setShowOwners] = useState(false)

  // Helper functions for diff visualization
  const getBaselineValue = (projectId, field) => {
    if (!baselineData || !baselineData.projects) return null
    const baselineProject = baselineData.projects.find(p => p.id === projectId)
    return baselineProject ? baselineProject[field] : null
  }

  const isProjectNew = (projectId) => {
    if (!baselineData || !baselineData.projects) return true
    return !baselineData.projects.find(p => p.id === projectId)
  }

  const hasValueChanged = (currentValue, baselineValue) => {
    if (baselineValue === null || baselineValue === undefined) return false
    const current = parseFloat(currentValue) || 0
    const baseline = parseFloat(baselineValue) || 0
    return current !== baseline
  }

  // Wrapper function to prevent changes when locked
  const safeHandleCellChange = (id, field, value) => {
    if (isTableLocked) {
      console.warn('Cell change blocked - table is locked')
      return
    }
    handleCellChange(id, field, value)
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{config.label} Team View</h2>
          <p className="text-gray-600">
            Manage {config.label.toLowerCase()} projects and sprint allocations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOwners}
              onChange={(e) => setShowOwners(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Owners</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-0 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-[0.5px] border-gray-200" style={{ minWidth: '300px', width: '300px' }}>
                  Epic
                </th>
                {showOwners && (
                  <th className="p-0 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}>
                    Owner
                  </th>
                )}
                {showOwners && (
                  <th className="p-0 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}>
                    Tech Owner
                  </th>
                )}
                <th className={`p-0 text-center text-[11px] font-medium text-gray-600 uppercase tracking-wider ${config.bgColor} border-[0.5px] border-gray-200`} style={{ minWidth: '90px', width: '90px' }}>
                  {config.label} Effort
                </th>
                <th className={`${config.bgColor} text-center text-xs font-medium text-gray-600 uppercase tracking-wider px-2 py-1`} style={{ minWidth: '100px', width: '100px' }}>
                  Allocated
                </th>
                <th className={`${config.bgColor} text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r-4 border-gray-300 px-2 py-1`} style={{ minWidth: '100px', width: '100px' }}>
                  Balance
                </th>
                {sprints.map((sprint, index) => {
                  const balance = calculateSprintBalance(team, sprint.id)
                  const isNegative = balance < 0
                  const isLast = index === sprints.length - 1
                  return (
                    <th
                      key={`sprint_${sprint.id}`}
                      className={`p-0 text-center ${isLast ? 'border-r-2 border-gray-300' : ''} ${isNegative ? 'bg-red-50' : 'bg-gray-50'} sticky top-0 z-20 border-[0.5px] border-gray-200`}
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      <div className="flex flex-col gap-0">
                        <div className="text-[11px] font-medium text-gray-700 uppercase tracking-wider">
                          {sprint.name || 'Sprint'}
                        </div>
                        <div className={`text-[11px] font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                          Bal: {balance}
                        </div>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="bg-white">
              {projects.map((project, index) => (
                <tr key={project.id} className={`group ${index % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50 transition-colors border-[0.5px] border-gray-200`}>
                  {/* Epic - Sticky with Move Buttons */}
                  <td className="p-0 relative sticky left-0 bg-white z-10 border-r-2 border-gray-300 border-[0.5px] border-gray-200" style={{ minWidth: '300px', width: '300px' }}>
                    <div className="flex items-center">
                      <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 z-10">
                        <button
                          onClick={() => handleMoveProject(project.id, 'up')}
                          disabled={index === 0 || isTableLocked}
                          className={`p-0.5 ${index === 0 || isTableLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
                          title="Move up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveProject(project.id, 'down')}
                          disabled={index === projects.length - 1 || isTableLocked}
                          className={`p-0.5 ${index === projects.length - 1 || isTableLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
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
                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 ${isTableLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                        title="Delete row"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={project.epic}
                          onChange={(e) => safeHandleCellChange(project.id, 'epic', e.target.value)}
                          disabled={isTableLocked}
                          className={`w-full h-5 py-0 px-1 pr-8 text-[11px] leading-none bg-transparent border-0 ${isTableLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 focus:bg-gray-100'} focus:outline-none focus:ring-0`}
                          placeholder="Enter epic name"
                          style={{ paddingLeft: '20px' }}
                        />
                        {showDiff && isProjectNew(project.id) && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-blue-500 text-white rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Owner */}
                  {showOwners && (
                    <td className="p-0 border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}>
                      <select
                        value={project.owner}
                        onChange={(e) => safeHandleCellChange(project.id, 'owner', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent border-0 ${isTableLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 focus:bg-gray-100'} focus:outline-none focus:ring-0 appearance-none cursor-pointer`}
                      >
                        <option value="">Select Owner</option>
                        {OWNER_OPTIONS.map((owner) => (
                          <option key={owner} value={owner}>
                            {owner}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  
                  {/* Tech Owner */}
                  {showOwners && (
                    <td className="p-0 border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}>
                      <select
                        value={project.techOwner}
                        onChange={(e) => safeHandleCellChange(project.id, 'techOwner', e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent border-0 ${isTableLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 focus:bg-gray-100'} focus:outline-none focus:ring-0 appearance-none cursor-pointer`}
                      >
                        <option value="">Select Tech Owner</option>
                        {TECH_OWNER_OPTIONS.map((techOwner) => (
                          <option key={techOwner} value={techOwner}>
                            {techOwner}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  
                  {/* Team Effort */}
                  <td className={`p-0 ${config.bgColor} ${showDiff && hasValueChanged(project[team], getBaselineValue(project.id, team)) ? 'bg-yellow-50' : ''} border-[0.5px] border-gray-200`} style={{ minWidth: '90px', width: '90px' }}>
                    <div className="flex flex-col">
                      <input
                        type="number"
                        value={(() => {
                          const val = formatNumber(project[team])
                          const num = parseFloat(val)
                          return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                        })()}
                        onChange={(e) => safeHandleCellChange(project.id, team, e.target.value)}
                        disabled={isTableLocked}
                        className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent border-0 ${isTableLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 focus:bg-gray-100'} focus:outline-none focus:ring-0 text-center placeholder:text-gray-200`}
                        placeholder="0"
                        min="0"
                        step="0.5"
                      />
                      {showDiff && hasValueChanged(project[team], getBaselineValue(project.id, team)) && (
                        <span className="text-[9px] text-gray-500 line-through px-1">
                          Was: {formatNumber(getBaselineValue(project.id, team)) || '0'}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Allocated */}
                  <td className={`${config.bgColor} text-center text-xs text-gray-600 px-2 py-1`} style={{ minWidth: '100px', width: '100px' }}>
                    {calculateProjectAllocated(project, team) || 0}
                  </td>
                  
                  {/* Balance */}
                  <td className={`${config.bgColor} text-center text-xs font-bold border-r-4 border-gray-300 px-2 py-1`} style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`${
                      calculateProjectBalance(project, team) < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, team) > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, team)}
                    </span>
                  </td>
                  
                  {/* Sprint Columns */}
                  {sprints.map((sprint, index) => {
                    const value = parseFloat(project[`${team}_${sprint.id}`]) || 0
                    const hasValue = value > 0
                    const isLast = index === sprints.length - 1
                    return (
                      <td 
                        key={`sprint_${sprint.id}`} 
                        className={`p-0 ${isLast ? 'border-r-2 border-gray-300' : ''} ${hasValue ? config.bgColorSprint : ''} ${showDiff && hasValueChanged(project[`${team}_${sprint.id}`], getBaselineValue(project.id, `${team}_${sprint.id}`)) ? 'bg-yellow-50' : ''} border-[0.5px] border-gray-200`} 
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <div className="flex flex-col">
                          <input
                            type="number"
                            value={(() => {
                              const val = formatNumber(project[`${team}_${sprint.id}`])
                              const num = parseFloat(val)
                              return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                            })()}
                            onChange={(e) => safeHandleCellChange(project.id, `${team}_${sprint.id}`, e.target.value)}
                            disabled={isTableLocked}
                            className={`w-full h-5 py-0 px-1 text-[11px] leading-none bg-transparent border-0 ${isTableLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 focus:bg-gray-100'} focus:outline-none focus:ring-0 text-center placeholder:text-gray-200`}
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
                          {showDiff && hasValueChanged(project[`${team}_${sprint.id}`], getBaselineValue(project.id, `${team}_${sprint.id}`)) && (
                            <span className="text-[9px] text-gray-500 line-through px-1">
                              Was: {formatNumber(getBaselineValue(project.id, `${team}_${sprint.id}`)) || '0'}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Summary Row */}
              <tr className={`bg-white font-bold border-t-[0.5px] border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}>
                <td className="p-0 sticky bottom-0 left-0 bg-white z-40 border-r-2 border-gray-300 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] border border-[0.5px] border-gray-200" style={{ minWidth: '300px', width: '300px' }}>
                  <span className="text-[11px] text-gray-700 px-1">Totals</span>
                </td>
                {showOwners && (
                  <td className="p-0 sticky bottom-0 bg-white z-30 border border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}></td>
                )}
                {showOwners && (
                  <td className="p-0 sticky bottom-0 bg-white z-30 border border-[0.5px] border-gray-200" style={{ minWidth: '120px', width: '120px' }}></td>
                )}
                
                {/* Team Effort Total */}
                <td className={`p-0 ${config.bgColor} text-center sticky bottom-0 z-30 border border-[0.5px] border-gray-200`} style={{ minWidth: '90px', width: '90px' }}>
                  <span className="text-[11px] text-gray-900">{calculateTotal(team) || 0}</span>
                </td>
                
                {/* Allocated Total */}
                <td className={`${config.bgColor} text-center text-xs text-gray-600 px-2 py-1 sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, team), 0) || 0}
                </td>
                
                {/* Balance Total */}
                <td className={`${config.bgColor} text-center text-xs font-bold border-r-4 border-gray-300 px-2 py-1 sticky bottom-0 z-30`} style={{ minWidth: '100px', width: '100px' }}>
                  <span className={`${
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, team), 0) < 0 ? 'text-red-600' : 
                    projects.reduce((sum, project) => sum + calculateProjectBalance(project, team), 0) > 0 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, team), 0) || 0}
                  </span>
                </td>
                
                {/* Sprint Totals */}
                {sprints.map((sprint, index) => {
                  const allocated = calculateSprintAllocated(team, sprint.id) || 0
                  const capacity = getSprintCapacity(team, sprint.id) || 0
                  const balance = calculateSprintBalance(team, sprint.id)
                  const hasValue = allocated > 0
                  const isLast = index === sprints.length - 1
                  return (
                    <td 
                      key={`footer_${sprint.id}`} 
                      className={`p-0 ${isLast ? 'border-r-2 border-gray-300' : ''} text-center ${hasValue ? config.bgColorSprint : 'bg-white'} sticky bottom-0 z-30 border border-[0.5px] border-gray-200`} 
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      <div className="flex flex-col space-y-0">
                        <div className="text-[11px] text-gray-500">{allocated}</div>
                        <div className="text-[11px] text-gray-500">{capacity}</div>
                        <div className="border-t border-gray-200 my-0"></div>
                        <div className={`text-[11px] font-bold ${
                          balance < 0 ? 'text-red-600' : 
                          balance > 0 ? 'text-green-600' : 
                          'text-gray-900'
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
        <div className="flex justify-center mt-2">
          <button
            onClick={handleAddRow}
            disabled={isTableLocked}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${isTableLocked ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'}`}
            title="Add New Project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamTab

