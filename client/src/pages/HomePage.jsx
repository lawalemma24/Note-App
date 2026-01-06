import React, { useState, useEffect } from 'react'
import NavBar from './NavBar.jsx'
import HomePageCard from './HomePageCard.jsx'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiEdit2, FiEye, FiTag, FiGrid, FiList } from 'react-icons/fi'
import { BsGridFill, BsListUl } from 'react-icons/bs'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedTags, setSelectedTags] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)

  const API_URL = 'https://note-app-rbyf.vercel.app/api/notes'

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [notes, searchQuery, categoryFilter, selectedTags])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error('Failed to fetch notes')
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = notes

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(note => note.category === categoryFilter)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        note.tags?.some(tag => selectedTags.includes(tag))
      )
    }

    setFilteredNotes(filtered)
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/${noteId}`)
      setNotes(notes.filter(note => note._id !== noteId))
      toast.success('Note deleted successfully')
      setShowDeleteModal(false)
      setNoteToDelete(null)
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  const confirmDelete = (note) => {
    setNoteToDelete(note)
    setShowDeleteModal(true)
  }

  const categories = ['all', ...new Set(notes.map(note => note.category).filter(Boolean))]
  const allTags = [...new Set(notes.flatMap(note => note.tags || []).filter(Boolean))]

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600 mt-2">Organize your thoughts and ideas</p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              Create Note
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{notes.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <FiEdit2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Public Notes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {notes.filter(note => note.isPublic).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50">
                  <FiEye className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {categories.length - 1}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <FiFilter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tags</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {allTags.length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <FiTag className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiGrid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiList className={`w-5 h-5 ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchNotes}
                disabled={loading}
                className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Filter by tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your notes...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-700">
                Showing <span className="font-semibold">{filteredNotes.length}</span> of{' '}
                <span className="font-semibold">{notes.length}</span> notes
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <FiEdit2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No notes found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {searchQuery || categoryFilter !== 'all' || selectedTags.length > 0
                    ? 'Try adjusting your search or filters'
                    : 'Create your first note to get started!'}
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <FiPlus className="w-5 h-5" />
                  Create New Note
                </Link>
              </div>
            ) : (
              /* Notes Display using HomePageCard */
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredNotes.map((note) => (
                  <HomePageCard
                    key={note._id}
                    note={note}
                    onDelete={confirmDelete}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noteToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setNoteToDelete(null)
                }}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(noteToDelete._id)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage