const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'deepfake_token'
const USER_KEY = 'deepfake_user'

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

function clearExpiredSession() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

function extractPayloadMessage(payload) {
  if (!payload) return ''
  if (payload.errors) {
    if (Array.isArray(payload.errors)) return payload.errors.filter(Boolean).join(' ')
    if (typeof payload.errors === 'object') return Object.values(payload.errors).flat().filter(Boolean).join(' ')
    return String(payload.errors)
  }
  return payload.error || payload.message || ''
}

async function readResponse(response, fallbackMessage) {
  let payload = null
  const rawText = await response.text().catch(() => '')

  if (rawText) {
    try {
      payload = JSON.parse(rawText)
    } catch {
      if (!response.ok) throw new Error(rawText || fallbackMessage)
      throw new Error('Invalid response from server.')
    }
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) clearExpiredSession()
    throw new Error(extractPayloadMessage(payload) || fallbackMessage)
  }

  return payload
}

async function request(path, options = {}, fallbackMessage = 'Request failed') {
  const token = getAuthToken()
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    })

    if (response.status === 204) return null
    return readResponse(response, fallbackMessage)
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Network error. Check your connection.')
    throw error
  }
}

function authPayload(response) {
  return response?.data || response
}

export const apiService = {
  login(credentials) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, 'Login failed').then(authPayload)
  },

  register(payload) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, 'Signup failed').then(authPayload)
  },

  getCurrentUser() {
    return request('/api/auth/me', {}, 'Session expired').then(authPayload)
  },

  uploadVideo(file, context = {}) {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('context', JSON.stringify(context))
    return request('/api/video/upload', { method: 'POST', body: formData }, 'Upload failed')
  },

  startAnalysis(videoId) {
    return request(`/api/analysis/start/${videoId}`, { method: 'POST' }, 'Analysis start failed')
  },

  getAnalysisStatus(videoId) {
    return request(`/api/analysis/status/${videoId}`, {}, 'Status check failed')
  },

  getResults(videoId) {
    return request(`/api/results/${videoId}`, {}, 'Results fetch failed')
  },

  getVideoList() {
    return request('/api/video', {}, 'Video list fetch failed')
  },

  getVideo(videoId) {
    return request(`/api/video/${videoId}`, {}, 'Video fetch failed')
  },

  deleteVideo(videoId) {
    return request(`/api/video/${videoId}`, { method: 'DELETE' }, 'Delete failed')
  },

  getAdminStats() {
    return request('/api/admin/stats', {}, 'Admin stats fetch failed')
  },

  getAdminVideos() {
    return request('/api/admin/videos?limit=100', {}, 'Admin videos fetch failed')
  },

  getAdminUsers() {
    return request('/api/admin/users', {}, 'Admin users fetch failed')
  },

  deleteAdminUser(userId) {
    return request(`/api/admin/users/${userId}`, { method: 'DELETE' }, 'User delete failed')
  },
}

export default apiService
