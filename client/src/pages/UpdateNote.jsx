import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import NavBar from './NavBar.jsx'
import { 
FiArrowLeft, FiSave,   FiTrash2, FiTag, FiLock, FiGlobe, FiFileText,FiX,FiEye,FiEyeOff,FiClock,FiCopy,FiShare2} from 'react-icons/fi'

const UpdateNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',    content: '',category: '',tags: [],tagInput: '',isPublic: false, color: 'bg-gradient-to-br from-blue-50 to-blue-100'
  })
  
  const [errors, setErrors] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Available colors
  const colorOptions = [
    { name: 'Blue', value: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200', label: 'bg-blue-100' },
    { name: 'Green', value: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200', label: 'bg-emerald-100' },
    { name: 'Purple', value: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200', label: 'bg-purple-100' },
    { name: 'Amber', value: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200', label: 'bg-amber-100' },
    { name: 'Rose', value: 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200', label: 'bg-rose-100' },
    { name: 'Cyan', value: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200', label: 'bg-cyan-100' },
  ]

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://note-app-43qu.vercel.app/${id}`)
      const note = response.data
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || '',
        tags: note.tags || [],
        tagInput: '',
        isPublic: note.isPublic || false,
        color: note.color || 'bg-gradient-to-br from-blue-50 to-blue-100'
      })
    } catch (error) {
      console.error('Error fetching note:', error)
      toast.error('Failed to load note')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  // Handle adding tags
  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }))
    }
  }

  // Handle removing tags
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setSaving(true)
    
    try {
      // Prepare data for API
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category.trim() || 'General',
        tags: formData.tags,
        isPublic: formData.isPublic,
        color: formData.color
      }
      
      // Send PUT request to update note
      const response = await axios.put(`http://localhost:3000/api/notes/${id}`, noteData)
      
      toast.success('✨ Note updated successfully!')
      console.log('Note updated:', response.data)
      
      // Navigate to the updated note
      setTimeout(() => navigate(`/notes/${id}`), 1000)
      
    } catch (error) {
      console.error('Error updating note:', error)
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error('Invalid data. Please check your inputs.')
            break
          case 401:
            toast.error('Please log in to update notes')
            navigate('/login')
            break
          case 404:
            toast.error('Note not found')
            navigate('/')
            break
          case 500:
            toast.error('Server error. Please try again later.')
            break
          default:
            toast.error('Failed to update note')
        }
      } else {
        toast.error('Network error. Please check your connection.')
      }
    } finally {
      setSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/notes/${id}`)
      toast.success('Note deleted successfully')
      navigate('/')
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  // Handle copy link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/notes/${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      <NavBar />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => navigate(`/`)}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group'
          >
            <FiArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
            Back to Note
          </button>
          
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'>
                <FiFileText className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Edit Note</h1>
                <p className='text-gray-600 mt-2'>Update your note content and settings</p>
              </div>
            </div>
            
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={handleCopyLink}
                className='px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all flex items-center gap-2 border border-blue-200'
              >
                <FiCopy className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-blue-600'}`} />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className='px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 transition-all flex items-center gap-2 border border-red-200'
              >
                <FiTrash2 className='w-5 h-5' />
                Delete Note
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
              {/* Form Header */}
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6'>
                <h2 className='text-2xl font-bold text-white'>Edit Note Details</h2>
                <p className='text-blue-100 mt-1'>Update the details below</p>
              </div>
              
              {/* Form Body */}
              <form onSubmit={handleSubmit} className='p-8'>
                {/* Title Field */}
                <div className='mb-8'>
                  <label className='block text-sm font-semibold text-gray-800 mb-3'>
                    Title <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 text-gray-800 rounded-xl border ${errors.title ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400`}
                    placeholder='Enter a captivating title...'
                    disabled={saving}
                  />
                  {errors.title && (
                    <p className='mt-2 text-sm text-red-600'>{errors.title}</p>
                  )}
                </div>

                {/* Content Field */}
                <div className='mb-8'>
                  <div className='flex justify-between items-center mb-3'>
                    <label className='block text-sm font-semibold text-gray-800'>
                      Content <span className='text-red-400'>*</span>
                    </label>
                    <span className={`text-sm ${formData.content.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.content.length}/1000
                    </span>
                  </div>
                  <textarea
                    name='content'
                    value={formData.content}
                    onChange={handleChange}
                    rows='12'
                    maxLength='1000'
                    className={`w-full px-4 py-3.5 text-gray-800 rounded-xl border ${errors.content ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none placeholder:text-gray-400`}
                    placeholder='Update your note content here...'
                    disabled={saving}
                  />
                  {errors.content && (
                    <p className='mt-2 text-sm text-red-600'>{errors.content}</p>
                  )}
                </div>

                {/* Category and Tags */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                  {/* Category */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-800 mb-3'>
                      Category
                    </label>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleChange}
                      className='w-full px-4 py-3.5 text-gray-800 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all'
                      disabled={saving}
                    >
                      <option value=''>Select category</option>
                      <option value='Personal'>🎯 Personal</option>
                      <option value='Work'>💼 Work</option>
                      <option value='Study'>📚 Study</option>
                      <option value='Ideas'>💡 Ideas</option>
                      <option value='To-Do'>✅ To-Do</option>
                      <option value='Meeting'>👥 Meeting Notes</option>
                      <option value='Project'>🚀 Project</option>
                      <option value='Other'>✨ Other</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-800 mb-3'>
                      <FiTag className='inline mr-2' />
                      Tags
                    </label>
                    <div className='flex gap-2 mb-3'>
                      <input
                        type='text'
                        name='tagInput'
                        value={formData.tagInput}
                        onChange={handleChange}
                        onKeyPress={handleTagKeyPress}
                        className='flex-1 px-4 py-3 rounded-lg text-gray-800 border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all'
                        placeholder='Add a tag...'
                        disabled={saving}
                      />
                      <button
                        type='button'
                        onClick={handleAddTag}
                        disabled={saving}
                        className='px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50'
                      >
                        <FiTag className='w-5 h-5' />
                      </button>
                    </div>
                    
                    {/* Tags Display */}
                    {formData.tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-sm'
                          >
                            {tag}
                            <button
                              type='button'
                              onClick={() => handleRemoveTag(tag)}
                              className='hover:text-blue-900 transition-colors disabled:opacity-50'
                              disabled={saving}
                            >
                              <FiX className='w-3 h-3' />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Selection */}
                <div className='mb-10'>
                  <label className='block text-sm font-semibold text-gray-800 mb-4'>
                    Note Color Theme
                  </label>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
                    {colorOptions.map((color) => (
                      <button
                        type='button'
                        key={color.name}
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        disabled={saving}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 border-transparent' : 'border-gray-200'}`}
                      >
                        <div className={`${color.label} w-full h-12 rounded-lg mb-2`} />
                        <span className='text-sm font-medium text-gray-700'>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy and Actions */}
                <div className='flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100'>
                  {/* Privacy Toggle */}
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <input
                        type='checkbox'
                        id='isPublic'
                        name='isPublic'
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className='sr-only'
                        disabled={saving}
                      />
                      <label
                        htmlFor='isPublic'
                        className={`flex items-center cursor-pointer ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`relative w-14 h-7 rounded-full transition-all ${formData.isPublic ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform transform ${formData.isPublic ? 'translate-x-7' : ''}`} />
                        </div>
                        <div className='ml-3 flex items-center gap-2'>
                          {formData.isPublic ? (
                            <>
                              <FiGlobe className='w-5 h-5 text-emerald-600' />
                              <span className='font-medium text-emerald-700'>Public Note</span>
                            </>
                          ) : (
                            <>
                              <FiLock className='w-5 h-5 text-gray-600' />
                              <span className='font-medium text-gray-700'>Private Note</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-4'>
                    <button
                      type='button'
                      onClick={() => navigate(`/`)}
                      disabled={saving}
                      className='px-8 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50'
                    >
                      Cancel
                    </button>
                    
                    <button
                      type='submit'
                      disabled={saving}
                    //    onClick={() => navigate(`/`)}
                      className='px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center'
                    >
                      {saving ? (
                        <>
                          <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className='w-5 h-5' />
                          Update Note
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* Preview Card */}
              <div className={`${formData.color} rounded-2xl shadow-xl border p-6 min-h-[400px] transition-all duration-300`}>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Live Preview</h3>
                
                <div className='space-y-6'>
                  {/* Title Preview */}
                  <div>
                    <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Title</div>
                    <div className='text-xl font-bold text-gray-800 line-clamp-2'>
                      {formData.title || 'Your note title will appear here'}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className='flex-1'>
                    <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Content</div>
                    <div className='text-gray-700 whitespace-pre-line line-clamp-6'>
                      {formData.content || 'Start typing your note content to see the preview here...'}
                    </div>
                  </div>

                  {/* Tags Preview */}
                  {formData.tags.length > 0 && (
                    <div>
                      <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Tags</div>
                      <div className='flex flex-wrap gap-2'>
                        {formData.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className='px-2.5 py-1 bg-white/50 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-white/20'>
                            {tag}
                          </span>
                        ))}
                        {formData.tags.length > 3 && (
                          <span className='px-2.5 py-1 bg-white/50 backdrop-blur-sm rounded-full text-sm text-gray-700'>
                            +{formData.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Privacy Badge */}
                  <div className='pt-4 border-t border-white/30'>
                    <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm'>
                      {formData.isPublic ? (
                        <>
                          <FiGlobe className='w-4 h-4 text-emerald-600' />
                          <span className='text-sm font-medium text-emerald-700'>Public</span>
                        </>
                      ) : (
                        <>
                          <FiLock className='w-4 h-4 text-gray-600' />
                          <span className='text-sm font-medium text-gray-700'>Private</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Note Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Characters</span>
                    <span className="font-semibold text-gray-900">{formData.content.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="font-semibold text-gray-900">
                      {formData.content.trim().split(/\s+/).filter(word => word.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tags</span>
                    <span className="font-semibold text-gray-900">{formData.tags.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center gap-2">
                      {formData.isPublic ? (
                        <>
                          <FiEye className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">Public</span>
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="w-4 h-4 text-gray-600" />
                          <span className="font-semibold text-gray-700">Private</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className='mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white'>
                <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                  <div className='p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600'>
                    <FiFileText className='w-5 h-5' />
                  </div>
                  Editing Tips
                </h3>
                <ul className='space-y-3 text-sm text-gray-300'>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5' />
                    <span>Keep titles clear and descriptive</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5' />
                    <span>Use tags to improve searchability</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5' />
                    <span>Choose colors that match the content mood</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5' />
                    <span>Mark public only if you want to share</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Note</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "<span className="font-semibold">{formData.title}</span>"?
              </p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  handleDelete()
                }}
                className="flex-1 px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
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

export default UpdateNote