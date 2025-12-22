import React from 'react'
import GanttModal from './GanttModal'

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
  setShowGanttModal
}) {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects Table</h2>
          <p className="text-gray-600">
            Manage quarterly projects and effort estimation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGanttModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Show Gantt
          </button>
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            + Add Row
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '60px', width: '60px' }}>
                  Move
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '300px', width: '300px' }}>
                  Epic
                </th>
                <th className="px-2 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '120px', width: '120px' }}>
                  Owner
                </th>
                <th className="px-2 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" style={{ minWidth: '120px', width: '120px' }}>
                  Tech Owner
                </th>
                {/* Backend Team Columns */}
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-green-100" style={{ minWidth: '90px', width: '90px' }}>
                  Backend
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-green-100" style={{ minWidth: '100px', width: '100px' }}>
                  Backend Allocated
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r-4 border-gray-400 bg-green-100" style={{ minWidth: '100px', width: '100px' }}>
                  Backend Balance
                </th>
                
                {/* Android Team Columns */}
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-blue-100" style={{ minWidth: '90px', width: '90px' }}>
                  Android
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-blue-100" style={{ minWidth: '100px', width: '100px' }}>
                  Android Allocated
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r-4 border-gray-400 bg-blue-100" style={{ minWidth: '100px', width: '100px' }}>
                  Android Balance
                </th>
                
                {/* iOS Team Columns */}
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-orange-100" style={{ minWidth: '90px', width: '90px' }}>
                  iOS
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-orange-100" style={{ minWidth: '100px', width: '100px' }}>
                  iOS Allocated
                </th>
                <th className="px-2 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r-2 border-gray-300 bg-orange-100" style={{ minWidth: '100px', width: '100px' }}>
                  iOS Balance
                </th>
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
                  {/* Epic - Text Input */}
                  <td className="px-4 py-4" style={{ minWidth: '300px', width: '300px' }}>
                    <input
                      type="text"
                      value={project.epic}
                      onChange={(e) => handleCellChange(project.id, 'epic', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter epic name"
                    />
                  </td>
                  
                  {/* Owner - Select Dropdown */}
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
                  
                  {/* Tech Owner - Select Dropdown */}
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
                  
                  {/* Backend Team Columns */}
                  <td className="px-2 py-4 bg-green-100" style={{ minWidth: '90px', width: '90px' }}>
                    <input
                      type="number"
                      value={(() => {
                        const val = formatNumber(project.backend)
                        const num = parseFloat(val)
                        return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                      })()}
                      onChange={(e) => handleCellChange(project.id, 'backend', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-2 py-4 bg-green-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'backend') || 0}
                    </span>
                  </td>
                  
                  <td className="px-2 py-4 border-r-4 border-gray-400 bg-green-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`text-sm font-semibold ${
                      calculateProjectBalance(project, 'backend') < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, 'backend') > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, 'backend')}
                    </span>
                  </td>
                  
                  {/* Android Team Columns */}
                  <td className="px-2 py-4 bg-blue-100" style={{ minWidth: '90px', width: '90px' }}>
                    <input
                      type="number"
                      value={(() => {
                        const val = formatNumber(project.android)
                        const num = parseFloat(val)
                        return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                      })()}
                      onChange={(e) => handleCellChange(project.id, 'android', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-2 py-4 bg-blue-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'android') || 0}
                    </span>
                  </td>
                  
                  <td className="px-2 py-4 border-r-4 border-gray-400 bg-blue-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
                    <span className={`text-sm font-semibold ${
                      calculateProjectBalance(project, 'android') < 0 ? 'text-red-600' : 
                      calculateProjectBalance(project, 'android') > 0 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {calculateProjectBalance(project, 'android')}
                    </span>
                  </td>
                  
                  {/* iOS Team Columns */}
                  <td className="px-2 py-4 bg-orange-100" style={{ minWidth: '90px', width: '90px' }}>
                    <input
                      type="number"
                      value={(() => {
                        const val = formatNumber(project.ios)
                        const num = parseFloat(val)
                        return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                      })()}
                      onChange={(e) => handleCellChange(project.id, 'ios', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  
                  <td className="px-2 py-4 bg-orange-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
                    <span className="text-sm font-medium text-gray-900">
                      {calculateProjectAllocated(project, 'ios') || 0}
                    </span>
                  </td>
                  
                  <td className="px-2 py-4 border-r-2 border-gray-300 bg-orange-100 text-center" style={{ minWidth: '100px', width: '100px' }}>
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
            </tbody>
            <tfoot>
              {/* Summary Row - Require */}
              <tr className="bg-white font-bold border-t-2 border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '60px', width: '60px' }}></td>
                <td className="px-4 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '300px', width: '300px' }}>
                  <span className="text-sm text-gray-700">Require</span>
                </td>
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '120px', width: '120px' }}></td>
                <td className="px-2 py-4 sticky bottom-[80px] bg-white z-30" style={{ minWidth: '120px', width: '120px' }}></td>
                
                {/* Backend Team Summary */}
                <td className="px-2 py-4 bg-green-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '90px', width: '90px' }}>
                  <span className="text-sm text-gray-900">{calculateTotal('backend') || 0}</span>
                </td>
                <td className="px-2 py-4 bg-green-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'backend'), 0) || 0}
                  </span>
                </td>
                <td className="px-2 py-4 border-r-4 border-gray-400 bg-green-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'backend'), 0) || 0}
                  </span>
                </td>
                
                {/* Android Team Summary */}
                <td className="px-2 py-4 bg-blue-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '90px', width: '90px' }}>
                  <span className="text-sm text-gray-900">{calculateTotal('android') || 0}</span>
                </td>
                <td className="px-2 py-4 bg-blue-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'android'), 0) || 0}
                  </span>
                </td>
                <td className="px-2 py-4 border-r-4 border-gray-400 bg-blue-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'android'), 0) || 0}
                  </span>
                </td>
                
                {/* iOS Team Summary */}
                <td className="px-2 py-4 bg-orange-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '90px', width: '90px' }}>
                  <span className="text-sm text-gray-900">{calculateTotal('ios') || 0}</span>
                </td>
                <td className="px-2 py-4 bg-orange-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectAllocated(project, 'ios'), 0) || 0}
                  </span>
                </td>
                <td className="px-2 py-4 border-r-2 border-gray-300 bg-orange-100 text-center sticky bottom-[80px] z-30" style={{ minWidth: '100px', width: '100px' }}>
                  <span className="text-sm text-gray-900">
                    {projects.reduce((sum, project) => sum + calculateProjectBalance(project, 'ios'), 0) || 0}
                  </span>
                </td>
              </tr>
            </tfoot>
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
                  <span className="text-sm text-gray-900">{backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className="text-sm text-gray-900">{androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="text-sm text-gray-900">{iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) || 0}</span>
                </td>
              </tr>
              
              {/* Balance Row */}
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                <td className="px-6 py-3 border-r border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Balance</span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className={`text-sm font-semibold ${
                    (backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')) < 0 ? 'text-red-600' : 
                    (backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')) > 0 ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {backendSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('backend')}
                  </span>
                </td>
                <td className="px-6 py-3 border-r border-gray-200 text-center">
                  <span className={`text-sm font-semibold ${
                    (androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')) < 0 ? 'text-red-600' : 
                    (androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')) > 0 ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {androidSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('android')}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`text-sm font-semibold ${
                    (iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('ios')) < 0 ? 'text-red-600' : 
                    (iosSprints.reduce((sum, sprint) => sum + (parseFloat(sprint.capacity) || 0), 0) - calculateTotal('ios')) > 0 ? 'text-green-600' : 
                    'text-gray-900'
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sprint Allocation</h2>
          <p className="text-gray-600">
            Allocate effort to specific sprints for each project
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Show Columns:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBackendSprints}
              onChange={(e) => setShowBackendSprints(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Backend</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAndroidSprints}
              onChange={(e) => setShowAndroidSprints(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Android</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIosSprints}
              onChange={(e) => setShowIosSprints(e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">iOS</span>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ minWidth: '1200px' }}>
              <thead className="bg-gray-50">
                {/* Super Headers Row - Team Grouping */}
                <tr>
                  <th className="px-4 py-3 border-r-2 border-gray-300 sticky top-0 left-0 bg-gray-50 z-30" style={{ minWidth: '250px', width: '250px' }}>
                    {/* Empty cell for Epic column */}
                  </th>
                  {showBackendSprints && (
                    <th 
                      colSpan={backendSprints.length}
                      className="px-4 py-3 bg-green-200 text-green-900 text-center font-bold border-b border-green-300 sticky top-0 z-30"
                    >
                      Backend Team Sprints
                    </th>
                  )}
                  {showAndroidSprints && (
                    <th 
                      colSpan={androidSprints.length}
                      className="px-4 py-3 bg-blue-200 text-blue-900 text-center font-bold border-b border-blue-300 sticky top-0 z-30"
                    >
                      Android Team Sprints
                    </th>
                  )}
                  {showIosSprints && (
                    <th 
                      colSpan={iosSprints.length}
                      className="px-4 py-3 bg-orange-200 text-orange-900 text-center font-bold border-b border-orange-300 sticky top-0 z-30"
                    >
                      iOS Team Sprints
                    </th>
                  )}
                </tr>
                
                {/* Sprint Names Row */}
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r-2 border-gray-300 sticky top-[48px] left-0 bg-gray-50 z-20" style={{ minWidth: '250px', width: '250px' }}>
                    Epic
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
                        className={`px-2 py-3 text-center ${
                          shouldShowBorder ? 'border-r-4 border-gray-400' : ''
                        } ${isNegative ? 'bg-red-50' : 'bg-gray-50'} sticky top-[48px] z-20`}
                        title={sprint.name || 'Unnamed Sprint'}
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
                  
                  {/* Android Sprint Columns */}
                  {showAndroidSprints && androidSprints.map((sprint, index) => {
                    const balance = calculateSprintBalance('android', sprint.id)
                    const isNegative = balance < 0
                    const isLastInGroup = index === androidSprints.length - 1
                    const shouldShowBorder = isLastInGroup && showIosSprints
                    return (
                      <th
                        key={`android_${sprint.id}`}
                        className={`px-2 py-3 text-center ${
                          shouldShowBorder ? 'border-r-4 border-gray-400' : ''
                        } ${isNegative ? 'bg-red-50' : 'bg-gray-50'} sticky top-[48px] z-20`}
                        title={sprint.name || 'Unnamed Sprint'}
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
                  
                  {/* iOS Sprint Columns */}
                  {showIosSprints && iosSprints.map((sprint) => {
                    const balance = calculateSprintBalance('ios', sprint.id)
                    const isNegative = balance < 0
                    return (
                      <th
                        key={`ios_${sprint.id}`}
                        className={`px-2 py-3 text-center ${isNegative ? 'bg-red-50' : 'bg-gray-50'} sticky top-[48px] z-20`}
                        title={sprint.name || 'Unnamed Sprint'}
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
                    <td className="px-4 py-4 border-r-2 border-gray-300 sticky left-0 bg-white z-10" style={{ minWidth: '250px', width: '250px' }}>
                      <span className="text-sm font-medium text-gray-900">{project.epic || 'Unnamed Epic'}</span>
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
                          className={`px-2 py-4 ${shouldShowBorder ? 'border-r-4 border-gray-400' : ''} ${hasValue ? 'bg-green-200' : ''}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <input
                            type="number"
                            value={(() => {
                              const val = formatNumber(project[`backend_${sprint.id}`])
                              const num = parseFloat(val)
                              return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                            })()}
                            onChange={(e) => handleCellChange(project.id, `backend_${sprint.id}`, e.target.value)}
                            className="w-full px-1 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
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
                          className={`px-2 py-4 ${shouldShowBorder ? 'border-r-4 border-gray-400' : ''} ${hasValue ? 'bg-blue-200' : ''}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <input
                            type="number"
                            value={(() => {
                              const val = formatNumber(project[`android_${sprint.id}`])
                              const num = parseFloat(val)
                              return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                            })()}
                            onChange={(e) => handleCellChange(project.id, `android_${sprint.id}`, e.target.value)}
                            className="w-full px-1 py-1 text-sm bg-transparent border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-200"
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
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
                          className={`px-2 py-4 ${hasValue ? 'bg-orange-200' : ''}`} 
                          style={{ minWidth: '80px', width: '80px' }}
                        >
                          <input
                            type="number"
                            value={(() => {
                              const val = formatNumber(project[`ios_${sprint.id}`])
                              const num = parseFloat(val)
                              return (val === '' || val === null || val === undefined || num === 0) ? '' : val
                            })()}
                            onChange={(e) => handleCellChange(project.id, `ios_${sprint.id}`, e.target.value)}
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
                {/* Summary Row with Footers */}
                <tr className="bg-white font-bold border-t-2 border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <td className="px-4 py-3 border-r-2 border-gray-300 sticky bottom-[80px] left-0 bg-white z-40 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" style={{ minWidth: '250px', width: '250px' }}>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-gray-500">Allocated</span>
                      <span className="text-xs text-gray-500">Capacity</span>
                      <span className="text-sm font-bold text-gray-900">Balance</span>
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
                        className={`px-2 py-3 ${shouldShowBorder ? 'border-r-4 border-gray-400' : ''} text-center ${hasValue ? 'bg-green-200' : 'bg-white'} sticky bottom-[80px] z-30`} 
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
                        className={`px-2 py-3 ${shouldShowBorder ? 'border-r-4 border-gray-400' : ''} text-center ${hasValue ? 'bg-blue-200' : 'bg-white'} sticky bottom-[80px] z-30`} 
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
                  
                  {/* iOS Sprint Footers */}
                  {showIosSprints && iosSprints.map((sprint) => {
                    const allocated = calculateSprintAllocated('ios', sprint.id) || 0
                    const capacity = getSprintCapacity('ios', sprint.id) || 0
                    const balance = calculateSprintBalance('ios', sprint.id)
                    const hasValue = allocated > 0
                    return (
                      <td 
                        key={`ios_footer_${sprint.id}`} 
                        className={`px-2 py-3 text-center ${hasValue ? 'bg-orange-200' : 'bg-white'} sticky bottom-[80px] z-30`} 
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

