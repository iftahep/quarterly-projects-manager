import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const TECH_OWNER_OPTIONS = ['Vitaly', 'Stas', 'Semyon', 'Dzimtry', 'Kirill', 'Shalom', 'Aharoni', 'Jenny']

// Tech Lead to Color mapping (light mode)
const TECH_LEAD_COLORS_LIGHT = {
  'Vitaly': 'bg-blue-200',
  'Stas': 'bg-purple-200',
  'Semyon': 'bg-blue-200',
  'Dzimtry': 'bg-green-200',
  'Kirill': 'bg-orange-200',
  'Shalom': 'bg-pink-200',
  'Aharoni': 'bg-cyan-200',
  'Jenny': 'bg-yellow-200'
}

// Tech Lead to Color mapping (dark mode)
const TECH_LEAD_COLORS_DARK = {
  'Vitaly': 'bg-blue-900/50',
  'Stas': 'bg-purple-900/50',
  'Semyon': 'bg-blue-900/50',
  'Dzimtry': 'bg-green-900/50',
  'Kirill': 'bg-orange-900/50',
  'Shalom': 'bg-pink-900/50',
  'Aharoni': 'bg-cyan-900/50',
  'Jenny': 'bg-yellow-900/50'
}

function TechReviewTab({
  techReviews,
  onTechReviewChange,
  onAddTechReview,
  onDeleteTechReview,
  allSprints, // Combined array of all sprints from all teams
  isTableLocked = false
}) {
  const { theme } = useTheme()

  // Theme-based classes - Modern SaaS style
  const bgCard = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderCard = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const bgTableHeader = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
  const textTableHeader = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const borderTable = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const bgTableBody = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const bgRowHover = theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
  const textInput = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const hoverInput = theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-slate-50'
  const focusInput = theme === 'dark' ? 'focus:bg-slate-600 focus:ring-2 focus:ring-slate-500' : 'focus:ring-2 focus:ring-indigo-500 focus:bg-transparent'
  const placeholderInput = theme === 'dark' ? 'placeholder:text-slate-600' : 'placeholder:text-slate-400'
  const bgInput = theme === 'dark' ? 'bg-slate-700' : 'bg-transparent'
  const textDeleteIcon = theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const hoverDeleteIcon = theme === 'dark' ? 'hover:text-red-400' : 'hover:text-red-600'
  const textDisabled = theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
  const bgAddButton = theme === 'dark' ? 'bg-blue-600' : 'bg-indigo-600'
  const hoverAddButton = theme === 'dark' ? 'hover:bg-blue-700' : 'hover:bg-indigo-700'

  // Get Backend sprints only
  const getAllSprints = () => {
    if (!allSprints || !Array.isArray(allSprints)) return []
    return allSprints
  }

  const sprints = getAllSprints()

  const handleCellChange = (id, field, value) => {
    if (isTableLocked) return
    onTechReviewChange(id, field, value)
  }

  const handleSprintToggle = (reviewId, sprintId) => {
    if (isTableLocked) return
    const review = techReviews.find(r => r.id === reviewId)
    if (!review || !review.techLead) {
      // If no tech lead selected, do nothing or show gray
      return
    }
    
    // Toggle the sprint
    const currentValue = review[sprintId] || false
    onTechReviewChange(reviewId, sprintId, !currentValue)
  }

  const getSprintCellColor = (review) => {
    if (!review.techLead) return ''
    const colorMap = theme === 'dark' ? TECH_LEAD_COLORS_DARK : TECH_LEAD_COLORS_LIGHT
    return colorMap[review.techLead] || (theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-200')
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} mb-2`}>
            Tech Reviews Planning
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
            Plan technical reviews across sprints for Tech Leads
          </p>
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
                <th className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-left text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border border-[0.5px] ${borderTable}`} style={{ minWidth: '150px', width: '150px' }}>
                  Tech Lead
                </th>
                {sprints.map((sprint) => (
                  <th
                    key={sprint.id}
                    className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} text-center text-[11px] font-medium ${textTableHeader} uppercase tracking-wider border border-[0.5px] ${borderTable}`}
                    style={{ minWidth: '80px', width: '80px' }}
                  >
                    {sprint.name || `Sprint ${sprint.id}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={bgTableBody}>
              {techReviews.map((review) => (
                <tr key={review.id} className={`group ${bgRowHover} transition-colors border-[0.5px] ${borderTable}`}>
                  {/* Epic - Text Input */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} relative border border-[0.5px] ${borderTable}`} style={{ minWidth: '300px', width: '300px' }}>
                    <button
                      onClick={() => onDeleteTechReview(review.id)}
                      disabled={isTableLocked}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 ${isTableLocked ? `${textDisabled} cursor-not-allowed` : `${textDeleteIcon} ${hoverDeleteIcon}`}`}
                      title="Delete row"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={review.epic || ''}
                      onChange={(e) => handleCellChange(review.id, 'epic', e.target.value)}
                      disabled={isTableLocked}
                      className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 pr-8 text-[11px] leading-none ${bgInput} ${textInput} ${theme === 'dark' ? 'border-0' : 'border-0'} ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${hoverInput} ${focusInput}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : 'focus:ring-2 focus:ring-indigo-500'}`}
                      placeholder="Enter epic name"
                    />
                  </td>

                  {/* Tech Lead - Select Dropdown */}
                  <td className={`${theme === 'dark' ? 'p-0' : 'py-2 px-2'} border border-[0.5px] ${borderTable}`} style={{ minWidth: '150px', width: '150px' }}>
                    <select
                      value={review.techLead || ''}
                      onChange={(e) => handleCellChange(review.id, 'techLead', e.target.value)}
                      disabled={isTableLocked}
                      className={`w-full ${theme === 'dark' ? 'h-5 py-0' : 'py-1'} px-1 text-[11px] leading-none ${bgInput} ${textInput} border-0 ${isTableLocked ? 'cursor-not-allowed opacity-50' : `${hoverInput} ${focusInput}`} focus:outline-none ${theme === 'dark' ? 'focus:ring-0' : 'focus:ring-2 focus:ring-indigo-500'} appearance-none cursor-pointer`}
                    >
                      <option value="" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Select Tech Lead</option>
                      {TECH_OWNER_OPTIONS.map((techLead) => (
                        <option key={techLead} value={techLead} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                          {techLead}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Sprint Columns - Toggle Cells */}
                  {sprints.map((sprint) => {
                    const isActive = review[sprint.id] === true
                    const cellColor = isActive ? getSprintCellColor(review) : ''
                    const canToggle = !isTableLocked && review.techLead

                    return (
                      <td
                        key={sprint.id}
                        onClick={() => handleSprintToggle(review.id, sprint.id)}
                        className={`
                          ${theme === 'dark' ? 'p-0' : 'py-2 px-2'} 
                          border border-[0.5px] ${borderTable} 
                          ${cellColor || (theme === 'dark' ? 'bg-slate-800' : 'bg-white')}
                          ${canToggle ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                          transition-colors
                        `}
                        style={{ minWidth: '80px', width: '80px' }}
                        title={!review.techLead ? 'Select Tech Lead first' : isActive ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {/* Empty cell - color indicates active state */}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="flex justify-center mt-2 pb-2">
          <button
            onClick={onAddTechReview}
            disabled={isTableLocked}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
              isTableLocked 
                ? `${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'} ${textDisabled} cursor-not-allowed` 
                : `${bgAddButton} text-white ${hoverAddButton} hover:shadow-md`
            }`}
            title="Add new tech review"
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

export default TechReviewTab

