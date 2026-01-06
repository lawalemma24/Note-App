import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import NavBar from './NavBar.jsx'
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiClock, 
  FiTag, 
  FiEye, 
  FiEyeOff, 
  FiCopy,
  FiShare2,
  FiBookmark,
  FiPrinter
} from 'react-icons/fi'
import { HiOutlineHashtag } from 'react-icons/hi'

const NoteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedNotes, setRelatedNotes] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const API_URL = 'http://localhost:3000/api/notes'

  useEffect(() => {
    fetchNote()
    fetchRelatedNotes()
  }, [id])

  const fetchNote = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      setNote(response.data)
    } catch (error) {
      console.error('Error fetching note:', error)
      toast.error('Failed to load note')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}`)
      const allNotes = response.data
      // Filter to show notes from same category (excluding current note)
      const related = allNotes
        .filter(n => n._id !== id)
        .filter(n => n.category === note?.category)
        .slice(0, 3)
      setRelatedNotes(related)
    } catch (error) {
      console.error('Error fetching related notes:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      toast.success('Note deleted successfully')
      navigate('/')
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading note...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <HiOutlineHashtag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Note Not Found</h3>
            <p className="text-gray-600 mb-8">The note you're looking for doesn't exist or has been deleted.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Notes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getNoteColor = () => {
    return note.color || 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 print:bg-white">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 print:py-4">
        {/* Header with Back Button */}
        <div className="mb-8 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-6"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Notes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`${getNoteColor()} rounded-3xl shadow-2xl border overflow-hidden print:shadow-none`}>
              {/* Note Header */}
              <div className="p-8 border-b border-white/30">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {note.category && (
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/60 backdrop-blur-sm text-gray-800 border border-white/30">
                          {note.category}
                        </span>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm">
                        {note.isPublic ? (
                          <>
                            <FiEye className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">Public</span>
                          </>
                        ) : (
                          <>
                            <FiEyeOff className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Private</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 print:text-3xl">
                      {note.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Last updated: {formatDate(note.updatedAt)}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="text-sm">
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 print:hidden">
                    <button
                      onClick={handleCopyLink}
                      className="p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all border border-white/30"
                      title="Copy link"
                    >
                      <FiCopy className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-gray-600'}`} />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all border border-white/30"
                      title="Print"
                    >
                      <FiPrinter className="w-5 h-5 text-gray-600" />
                    </button>
                    <Link
                      to={`/edit/${note._id}`}
                      className="p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all border border-white/30"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all border border-white/30"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {note.content}
                  </div>
                </div>

                {/* Tags Section */}
                {note.tags && note.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-white/30">
                    <div className="flex items-center gap-2 mb-4">
                      <FiTag className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-white/60 backdrop-blur-sm text-gray-800 border border-white/30 hover:bg-white/80 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="print:hidden">
            <div className="sticky top-8 space-y-6">
              {/* Note Info Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Note Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                    <p className="text-gray-900 font-medium">{note.category || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {note.isPublic ? (
                        <>
                          <FiEye className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Public</span>
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">Private</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                    <p className="text-gray-900">{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                    <p className="text-gray-900">{formatDate(note.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Character Count</p>
                    <p className="text-gray-900">{note.content.length} characters</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to={`/edit/${note._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <FiEdit2 className="w-5 h-5" />
                    <span className="font-medium">Edit Note</span>
                  </Link>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <FiShare2 className="w-5 h-5" />
                    <span className="font-medium">Share Note</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <FiPrinter className="w-5 h-5" />
                    <span className="font-medium">Print Note</span>
                  </button>
                </div>
              </div>

              {/* Related Notes */}
              {relatedNotes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Related Notes</h3>
                  <div className="space-y-4">
                    {relatedNotes.map(relatedNote => (
                      <Link
                        key={relatedNote._id}
                        to={`/notes/${relatedNote._id}`}
                        className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {relatedNote.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {relatedNote.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(relatedNote.updatedAt)}</span>
                          {relatedNote.isPublic && (
                            <FiEye className="w-3 h-3 text-emerald-600" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteDetail