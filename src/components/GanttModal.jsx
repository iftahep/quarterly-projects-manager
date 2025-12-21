import React from 'react'

function GanttModal({ isOpen, onClose, projects, backendSprints, androidSprints, iosSprints }) {
  if (!isOpen) return null

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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quarterly Timeline</h2>
            <p className="text-sm text-gray-600 mt-1">Gantt Chart View</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-600">Backend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">Android</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">iOS</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {/* Project Name Column */}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r-2 border-gray-300 sticky left-0 bg-gray-100 z-20" style={{ minWidth: '250px', width: '250px' }}>
                    Project (Epic)
                  </th>
                  
                  {/* Sprint Columns */}
                  {backendSprints.map((sprint, index) => (
                    <th
                      key={`sprint_${sprint.id}`}
                      className="px-3 py-3 text-center text-xs font-medium text-gray-700 border-r border-gray-200"
                      style={{ minWidth: '120px' }}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{sprint.name || `Sprint ${index + 1}`}</span>
                        <span className="text-xs text-gray-500 mt-1">Backend</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {projects.map((project, projectIndex) => (
                  <tr key={project.id} className="border-b border-gray-200">
                    {/* Project Name - Sticky */}
                    <td className="px-4 py-3 border-r-2 border-gray-300 sticky left-0 bg-white z-10 font-medium text-gray-900" style={{ minWidth: '250px', width: '250px' }}>
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
                          className="px-0 py-0 border-r border-gray-200 align-top"
                          style={{ minWidth: '120px', height: '60px' }}
                        >
                          <div className="h-full flex flex-col">
                            {/* Backend Track */}
                            <div className="flex-1 border-b border-gray-100 relative">
                              {backendAlloc > 0 && (
                                <div className="h-full bg-green-400 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {backendAlloc}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Android Track */}
                            <div className="flex-1 border-b border-gray-100 relative">
                              {androidAlloc > 0 && (
                                <div className="h-full bg-blue-400 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {androidAlloc}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* iOS Track */}
                            <div className="flex-1 relative">
                              {iosAlloc > 0 && (
                                <div className="h-full bg-orange-400 flex items-center justify-center">
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

