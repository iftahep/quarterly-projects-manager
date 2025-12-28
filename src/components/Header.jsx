import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Header({ onSave, viewMode, onSetBaseline, hasBaseline }) {
  const { theme, toggleTheme } = useTheme()
  const [showToast, setShowToast] = useState(false)

  const handleSave = () => {
    if (onSave && onSave()) {
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }
  }

  const bgHeader = theme === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderHeader = theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
  const textTitle = theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  const textSubtitle = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  return (
    <header className={`${bgHeader} shadow-sm border-b ${borderHeader} sticky top-0 z-30`}>
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${textTitle}`}>
            Quarters Management 365Scores
            </h1>
            <p className={`text-sm ${textSubtitle} mt-1`}>
              Track and manage your quarterly projects
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {/* Set Baseline Button - Only in LIVE mode */}
            {viewMode === 'LIVE' && (
              <button
                onClick={onSetBaseline}
                className={`px-4 py-2 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Set Baseline
              </button>
            )}
            {/* Save Changes Button - Only in LIVE mode */}
            {viewMode === 'LIVE' && (
              <button
                onClick={handleSave}
                className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Data saved successfully!</span>
        </div>
      )}
    </header>
  )
}

export default Header

