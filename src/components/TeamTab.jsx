import React from 'react'

const OWNER_OPTIONS = ['Oren', 'Shchory', 'Bar', 'Ben', 'Ohad', 'Ronen', 'Jenny', 'Aharoni', 'Rick']
const TECH_OWNER_OPTIONS = ['Vitaly', 'Stas', 'Semyon', 'Dzimtry', 'Kirill', 'Shalom', 'Aharoni', 'Jenny']

function TeamTab({
  team,
  projects,
  sprints,
  handleAddRow,
  handleCellChange,
  handleMoveProject,
  formatNumber,
  calculateTotal,
  calculateProjectAllocated,
  calculateProjectBalance,
  calculateSprintAllocated,
  calculateSprintBalance,
  getSprintCapacity
}) {
  // Team-specific styling
  const teamConfig = {
    backend: {
      label: 'Backend',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    android: {
      label: 'Android',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    ios: {
      label: 'iOS',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200'
    }
  }

  const config = teamConfig[team]

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{config.label} Team View</h2>
          <p className="text-gray-600">
            Manage {config.label.toLowerCase()} projects and sprint allocations
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
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '60px', width: '60px' }}>
                  Move
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 z-20" style={{ minWidth: '300px', width: '300px' }}>
                  Epic
                </th>
                <th className="px-2 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '120px', width: '120px' }}>
                  Owner
                </th>
                <th className="px-2 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '120px', width: '120px' }}>
                  Tech Owner
                </th>
                <th className={`px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider ${config.bgColor}`} style={{ minWidth: '90px', width: '90px' }}>
                  {config.label} Effort
                </th>
                {sprints.map((sprint, index) => {
                  const balance = calculateSprintBalance(team, sprint.id)
                  const isNegative = balance < 0
                  const isLast = index === sprints.length - 1
                  return (
                    <th
                      key={`sprint_${sprint.id}`}
                      className={`px-2 py-3 text-center ${isLast ? 'border-r-2 border-gray-300' : ''} ${isNegative ? 'bg-red-50' : 'bg-gray-50'} sticky top-0 z-20`}
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {sprint.name || 'Sprint'}
                        </div>
                        <div className={`text-xs font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
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
                <tr key={project.id} className={`${index % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50 transition-colors border-b border-gray-100`}>
                  {/* Move Buttons */}
                  <td className="px-2 py-4 text-center" style={{ minWidth: '60px', width: '60px' }}>
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        onClick={() => handleMoveProject(project.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded transition-colors ${
                          index === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveProject(project.id, 'down')}
                        disabled={index === projects.length - 1}
                        className={`p-1 rounded transition-colors ${
                          index === projects.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  
                  {/* Epic - Sticky */}
                  <td className="px-4 py-4 sticky left-0 bg-white z-10 border-r-2 border-gray-300" style={{ minWidth: '300px', width: '300px' }}>
                    <input
                      type="text"
                      value={project.epic}
                      onChange={(e) => handleCellChange(project.id, 'epic', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter epic name"
                    />
                  </td>
                  
                  {/* Owner */}
                  <td className="px-2 py-4" style={{ minWidth: '120px', width: '120px' }}>
                    <select
                      value={project.owner}
                      onChange={(e) => handleCellChange(project.id, 'owner', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select Owner</option>
                      {OWNER_OPTIONS.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Tech Owner */}
                  <td className="px-2 py-4" style={{ minWidth: '120px', width: '120px' }}>
                    <select
                      value={project.techOwner}
                      onChange={(e) => handleCellChange(project.id, 'techOwner', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select Tech Owner</option>
                      {TECH_OWNER_OPTIONS.map((techOwner) => (
                        <option key={techOwner} value={techOwner}>
                          {techOwner}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Team Effort */}
                  <td className={`px-2 py-4 ${config.bgColor}`} style={{ minWidth: '90px', width: '90px' }}>
                    <input
                      type="number"
                      value={(() => {
                        const val = formatNumber(project[team])
                        const num = parseFloat(val)
                        return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                      })()}
                      onChange={(e) => handleCellChange(project.id, team, e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  {/* Sprint Columns */}
                  {sprints.map((sprint, index) => {
                    const value = parseFloat(project[`${team}_${sprint.id}`]) || 0
                    const hasValue = value > 0
                    const isLast = index === sprints.length - 1
                    return (
                      <td 
                        key={`sprint_${sprint.id}`} 
                        className={`px-2 py-4 ${isLast ? 'border-r-2 border-gray-300' : ''} ${hasValue ? config.bgColor : ''}`} 
                        style={{ minWidth: '80px', width: '80px' }}
                      >
                        <input
                          type="number"
                          value={(() => {
                            const val = formatNumber(project[`${team}_${sprint.id}`])
                            const num = parseFloat(val)
                            return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                          })()}
                          onChange={(e) => handleCellChange(project.id, `${team}_${sprint.id}`, e.target.value)}
                          className="w-full px-1 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                          placeholder="0"
                          min="0"
                          step="0.5"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Summary Row */}
              <tr className={`bg-white font-bold border-t-2 border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}>
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '60px', width: '60px' }}></td>
                <td className="px-4 py-4 sticky bottom-[80px] left-0 bg-white z-40 border-r-2 border-gray-300 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" style={{ minWidth: '300px', width: '300px' }}>
                  <span className="text-sm text-gray-700">Totals</span>
                </td>
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '120px', width: '120px' }}></td>
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '120px', width: '120px' }}></td>
                
                {/* Team Effort Total */}
                <td className={`px-2 py-4 ${config.bgColor} text-center sticky bottom-[80px] z-30`} style={{ minWidth: '90px', width: '90px' }}>
                  <span className="text-sm text-gray-900">{calculateTotal(team) || 0}</span>
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
                      className={`px-2 py-3 ${isLast ? 'border-r-2 border-gray-300' : ''} text-center ${hasValue ? config.bgColor : 'bg-white'} sticky bottom-[80px] z-30`} 
                      style={{ minWidth: '80px', width: '80px' }}
                    >
                      <div className="flex flex-col space-y-0">
                        <div className="text-xs text-gray-500">{allocated}</div>
                        <div className="text-xs text-gray-500">{capacity}</div>
                        <div className="border-t border-gray-200 my-1"></div>
                        <div className={`text-sm font-bold ${
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
      </div>
    </div>
  )
}

export default TeamTab

