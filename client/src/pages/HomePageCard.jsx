import React from 'react'
import { Link } from 'react-router-dom'
import { FiEye, FiEyeOff, FiEdit2, FiTrash2, FiClock, FiTag } from 'react-icons/fi'

const HomePageCard = ({ note, onDelete, viewMode = 'grid' }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getNoteColor = () => {
    return note.color || 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
  }

  // Prevent click event propagation
  const handleEditClick = (e) => {
    e.stopPropagation()
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    onDelete(note)
  }

  // Grid view card
  if (viewMode === 'grid') {
    return (
      <div className={`${getNoteColor()} rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 min-h-[280px] flex flex-col cursor-pointer group`}>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <Link to={`/notes/${note._id}`} className="block">
              <h3 className="text-xl font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                {note.title}
              </h3>
            </Link>
            {note.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/50 backdrop-blur-sm text-gray-700">
                {note.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {note.isPublic ? (
              <FiEye className="w-4 h-4 text-emerald-600" />
            ) : (
              <FiEyeOff className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Content Preview */}
        <Link to={`/notes/${note._id}`} className="block flex-1 mb-4">
          <p className="text-gray-700 line-clamp-4">
            {note.content}
          </p>
        </Link>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-white/60 backdrop-blur-sm text-gray-700 border border-white/30"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/60 backdrop-blur-sm text-gray-700">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/30">
          <div className="flex items-center justify-between">
            <Link to={`/notes/${note._id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              <FiClock className="w-4 h-4" />
              <span>{formatDate(note.updatedAt)}</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${note._id}`}
                onClick={handleEditClick}
                className="p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-colors"
              >
                <FiEdit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" />
              </Link>
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-colors"
              >
                <FiTrash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List view card
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side - Content */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className={`${getNoteColor()} w-4 h-full rounded-lg`}></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link to={`/notes/${note._id}`} className="block">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {note.title}
                  </h3>
                </Link>
                {note.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {note.category}
                  </span>
                )}
              </div>
              
              <Link to={`/notes/${note._id}`} className="block mb-3">
                <p className="text-gray-600 line-clamp-2">
                  {note.content}
                </p>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link to={`/notes/${note._id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <FiClock className="w-4 h-4" />
                  <span>{formatDate(note.updatedAt)}</span>
                </Link>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{note.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {note.isPublic ? (
              <FiEye className="w-4 h-4 text-emerald-600" />
            ) : (
              <FiEyeOff className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${note._id}`}
              onClick={handleEditClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiEdit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" />
            </Link>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiTrash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePageCard