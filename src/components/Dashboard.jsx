import { useState } from 'react'

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    quarter: 'Q1 2024',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-03-31',
    team: 'Frontend Team'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    quarter: 'Q1 2024',
    status: 'Planning',
    progress: 20,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    team: 'Mobile Team'
  },
  {
    id: 3,
    name: 'API Integration',
    quarter: 'Q1 2024',
    status: 'Completed',
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    team: 'Backend Team'
  },
  {
    id: 4,
    name: 'Database Migration',
    quarter: 'Q2 2024',
    status: 'Not Started',
    progress: 0,
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    team: 'DevOps Team'
  },
  {
    id: 5,
    name: 'Security Audit',
    quarter: 'Q1 2024',
    status: 'In Progress',
    progress: 45,
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    team: 'Security Team'
  }
]

function Dashboard() {
  const [projects] = useState(mockProjects)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'Not Started':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Overview of all quarterly projects
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{project.quarter}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{project.team}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {project.startDate} - {project.endDate}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

