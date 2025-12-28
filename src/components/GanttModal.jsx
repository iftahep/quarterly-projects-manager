import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

function GanttModal({ isOpen, onClose, projects, backendSprints, androidSprints, iosSprints }) {
  const { theme } = useTheme()
  
  if (!isOpen) return null
  
  // Theme-based classes
  const bgOverlay = theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'
  const bgModal = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderModal = theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
  const textTitle = theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
  const textSubtitle = theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
  const textLabel = theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
  const bgButton = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
  const textButton = theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
  const hoverButton = theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-300'
  const bgTable = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
  const bgTableHeader = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
  const textTableHeader = theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
  const borderTable = theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
  const borderTableSticky = theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
  const bgRowHover = theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-gray-100'
  const textProject = theme === 'dark' ? 'text-slate-200' : 'text-gray-900'
  const bgTrack = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
  const textTrack = theme === 'dark' ? 'text-slate-400' : 'text-gray-600'

  // Calculate allocation for a project in a specific sprint
  const getSprintAllocation = (project, team, sprintIndex) => {
    let sprintId
    if (team === 'backend') {
      sprintId = backendSprints[sprintIndex]?.id
    } else if (team === 'android') {
      sprintId = androidSprints[sprintIndex]?.id
    } else if (team === 'ios') {
      sprintId = iosSprints[sprintIndex]?.id
    }
    
    if (!sprintId) return 0
    
    const fieldName = `${team}_${sprintId}`
    return parseFloat(project[fieldName]) || 0
  }

  // Check if a project has allocation in a sprint
  const hasAllocation = (project, team, sprintIndex) => {
    return getSprintAllocation(project, team, sprintIndex) > 0
  }

  // Get the maximum number of sprints across all teams
  const maxSprints = Math.max(
    backendSprints.length,
    androidSprints.length,
    iosSprints.length
  )

  return (
    <div className={`fixed inset-0 ${bgOverlay} z-50 flex items-center justify-center p-4`}>
      <div className={`${bgModal} rounded-lg shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col border ${borderModal}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${borderModal} flex justify-between items-center`}>
          <div>
            <h2 className={`text-2xl font-bold ${textTitle}`}>Quarterly Timeline</h2>
            <p className={`text-sm ${textSubtitle} mt-1`}>Gantt Chart View</p>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${textButton} ${bgButton} rounded-lg ${hoverButton} transition-colors font-medium`}
          >
            Close
          </button>
        </div>

        {/* Legend */}
        <div className={`px-6 py-3 ${bgModal} border-b ${borderModal}`}>
          <div className="flex items-center gap-6">
            <span className={`text-sm font-medium ${textLabel}`}>Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
              <span className={`text-sm ${textLabel}`}>Backend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className={`text-sm ${textLabel}`}>Android</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className={`text-sm ${textLabel}`}>iOS</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className={`flex-1 overflow-auto ${bgTable}`}>
          <div className="min-w-full">
            <table className="min-w-full border-collapse">
              <thead className={`${bgTableHeader} sticky top-0 z-10`}>
                <tr>
                  {/* Project Name Column */}
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${textTableHeader} uppercase tracking-wider border-r-2 ${borderTableSticky} sticky left-0 ${bgTableHeader} z-20`} style={{ minWidth: '250px', width: '250px' }}>
                    Project (Epic)
                  </th>
                  
                  {/* Sprint Columns */}
                  {backendSprints.map((sprint, index) => (
                    <th
                      key={`sprint_${sprint.id}`}
                      className={`px-3 py-3 text-center text-xs font-medium ${textTableHeader} border-r ${borderTable}`}
                      style={{ minWidth: '120px' }}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{sprint.name || `Sprint ${index + 1}`}</span>
                        <span className={`text-xs ${textSubtitle} mt-1`}>Backend</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={bgTable}>
                {projects.map((project, projectIndex) => (
                  <tr key={project.id} className={`border-b ${borderTable} ${bgRowHover}`}>
                    {/* Project Name - Sticky */}
                    <td className={`px-4 py-3 border-r-2 ${borderTableSticky} sticky left-0 ${bgTable} z-10 font-medium ${textProject}`} style={{ minWidth: '250px', width: '250px' }}>
                      {project.epic || `Project ${projectIndex + 1}`}
                    </td>
                    
                    {/* Sprint Cells with 3 Sub-tracks */}
                    {backendSprints.map((sprint, sprintIndex) => {
                      const backendAlloc = getSprintAllocation(project, 'backend', sprintIndex)
                      const androidAlloc = getSprintAllocation(project, 'android', sprintIndex)
                      const iosAlloc = getSprintAllocation(project, 'ios', sprintIndex)
                      
                      return (
                        <td
                          key={`cell_${project.id}_${sprint.id}`}
                          className={`px-0 py-0 border-r ${borderTable} align-top`}
                          style={{ minWidth: '120px', height: '60px' }}
                        >
                          <div className="h-full flex flex-col">
                            {/* Backend Track */}
                            <div className={`flex-1 border-b ${borderTable} relative`}>
                              {backendAlloc > 0 && (
                                <div className="h-full bg-emerald-500 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {backendAlloc}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Android Track */}
                            <div className={`flex-1 border-b ${borderTable} relative`}>
                              {androidAlloc > 0 && (
                                <div className="h-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {androidAlloc}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* iOS Track */}
                            <div className="flex-1 relative">
                              {iosAlloc > 0 && (
                                <div className="h-full bg-amber-500 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {iosAlloc}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GanttModal

