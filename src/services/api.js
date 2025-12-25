const API_BASE_URL = 'http://localhost:3001/api'

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Quarter API
export const quarterAPI = {
  // Get all quarters
  getAll: async () => {
    return apiCall('/quarters')
  },

  // Get active quarter
  getActive: async () => {
    return apiCall('/quarters/active')
  },

  // Get quarter by ID
  getById: async (id) => {
    return apiCall(`/quarters/${id}`)
  },

  // Create new quarter
  create: async (name, data) => {
    return apiCall('/quarters', {
      method: 'POST',
      body: JSON.stringify({ name, data })
    })
  },

  // Update quarter
  update: async (id, updates) => {
    return apiCall(`/quarters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  },

  // Activate quarter
  activate: async (id) => {
    return apiCall(`/quarters/${id}/activate`, {
      method: 'POST'
    })
  },

  // Delete quarter
  delete: async (id) => {
    return apiCall(`/quarters/${id}`, {
      method: 'DELETE'
    })
  },

  // Set baseline for quarter (optional data for edit mode)
  setBaseline: async (id, data) => {
    return apiCall(`/quarters/${id}/baseline`, {
      method: 'POST',
      body: data ? JSON.stringify({ data }) : undefined
    })
  }
}

// Health check
export const healthCheck = async () => {
  return apiCall('/health')
}

