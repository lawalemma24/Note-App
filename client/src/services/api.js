const API_BASE = 'http://localhost:3000/api/notes';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Note CRUD Operations
export const noteService = {
  // GET /api/notes - Get all notes with filters
  getAllNotes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`?${queryString}`);
  },

  // GET /api/notes/:id - Get single note
  getNoteById: (id) => apiRequest(`/${id}`),

  // POST /api/notes - Create new note
  createNote: (noteData) => 
    apiRequest('', {
      method: 'POST',
      body: JSON.stringify(noteData),
    }),

  // PUT /api/notes/:id - Update note
  updateNote: (id, noteData) =>
    apiRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    }),

  // DELETE /api/notes/:id - Delete note
  deleteNote: (id) =>
    apiRequest(`/${id}`, {
      method: 'DELETE',
    }),

  // PATCH /api/notes/:id/favorite - Toggle favorite
  toggleFavorite: (id) =>
    apiRequest(`/${id}/favorite`, {
      method: 'PATCH',
    }),

  // PATCH /api/notes/:id/archive - Toggle archive
  toggleArchive: (id) =>
    apiRequest(`/${id}/archive`, {
      method: 'PATCH',
    }),
};

// Statistics Operations
export const statsService = {
  // GET /api/notes/stats/overview - Get overview statistics
  getOverviewStats: () => apiRequest('/stats/overview'),

  // GET /api/notes/stats/tags - Get tag statistics
  getTagStats: () => apiRequest('/stats/tags'),

  // GET /api/notes/stats/activity - Get recent activity
  getActivity: () => apiRequest('/stats/activity'),

  // GET /api/notes/stats/detailed - Get detailed statistics
  getDetailedStats: () => apiRequest('/stats/detailed'),
};

// Combined service
export const apiService = {
  ...noteService,
  ...statsService,
  
  // Search notes
  searchNotes: (query) => noteService.getAllNotes({ search: query }),
  
  // Get notes by tag
  getNotesByTag: (tag) => noteService.getAllNotes({ tag }),
  
  // Get favorite notes
  getFavoriteNotes: () => noteService.getAllNotes({ favorite: 'true' }),
  
  // Get archived notes
  getArchivedNotes: () => noteService.getAllNotes({ archived: 'true' }),
};