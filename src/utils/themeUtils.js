// Theme utility functions for conditional class names
export const getThemeClasses = (theme) => {
  return {
    // Backgrounds - Modern SaaS Light Mode
    bgMain: theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50',
    bgSecondary: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgTertiary: theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100',
    bgCard: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgHeader: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgSidebar: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgTable: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgTableHeader: theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50',
    bgTableRow: theme === 'dark' ? 'bg-slate-700/30' : '', // No zebra striping in light mode
    bgTableRowHover: theme === 'dark' ? 'bg-slate-700/50' : 'hover:bg-slate-50',
    
    // Borders - Subtle slate borders for light mode
    borderMain: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    borderSecondary: theme === 'dark' ? 'border-slate-600' : 'border-slate-300',
    borderCard: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    borderSidebar: theme === 'dark' ? 'border-slate-700' : 'border-r-slate-200',
    
    // Text - Slate palette for light mode
    textPrimary: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
    textTertiary: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    textMuted: theme === 'dark' ? 'text-slate-500' : 'text-slate-500',
    textHeader: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    
    // Inputs - No borders, ring on focus for light mode
    bgInput: theme === 'dark' ? 'bg-slate-700' : 'bg-transparent',
    borderInput: theme === 'dark' ? 'border-slate-600' : 'border-0',
    textInput: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    placeholderInput: theme === 'dark' ? 'placeholder-slate-600' : 'placeholder-slate-400',
    hoverInput: theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-slate-50',
    focusInput: theme === 'dark' ? 'focus:bg-slate-600 focus:ring-2 focus:ring-slate-500' : 'focus:ring-2 focus:ring-indigo-500 focus:bg-transparent',
    
    // Primary Actions - Indigo for light mode
    bgPrimary: theme === 'dark' ? 'bg-blue-600' : 'bg-indigo-600',
    bgPrimaryHover: theme === 'dark' ? 'hover:bg-blue-700' : 'hover:bg-indigo-700',
    textPrimary: theme === 'dark' ? 'text-blue-400' : 'text-indigo-600',
    bgPrimaryActive: theme === 'dark' ? 'bg-blue-900/30' : 'bg-indigo-50',
    textPrimaryActive: theme === 'dark' ? 'text-blue-400' : 'text-indigo-700',
    
    // Team colors (keep team colors but adjust opacity for light mode)
    bgBackend: theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50',
    bgAndroid: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
    bgIos: theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50',
    
    // Diff highlighting
    bgDiff: theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-50',
    textDiff: theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800',
  }
}

