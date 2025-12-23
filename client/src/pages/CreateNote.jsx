import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import NavBar from './NavBar.jsx'
import { 
  FiArrowLeft, 
  FiSave, 
  FiTag, 
  FiLock, 
  FiGlobe, 
  FiFileText,
  FiX,
  FiPlus
} from 'react-icons/fi'

const CreateNotePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    tagInput: '',
    isPublic: false,
    color: 'bg-gradient-to-br from-blue-50 to-blue-100'
  })
  
  const [errors, setErrors] = useState({})

  // Available colors
  const colorOptions = [
    { name: 'Blue', value: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200', label: 'bg-blue-100' },
    { name: 'Green', value: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200', label: 'bg-emerald-100' },
    { name: 'Purple', value: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200', label: 'bg-purple-100' },
    { name: 'Amber', value: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200', label: 'bg-amber-100' },
    { name: 'Rose', value: 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200', label: 'bg-rose-100' },
    { name: 'Cyan', value: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200', label: 'bg-cyan-100' },
  ]

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

  // Handle form submission - DIRECT API CALL
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
    
  //   if (!validateForm()) {
  //     toast.error('Please fix the errors in the form')
  //     return
  //   }
    
  //   setLoading(true)
    
  //   try {
  //     // Prepare data for API
  //     const noteData = {
  //       title: formData.title.trim(),
  //       content: formData.content.trim(),
  //       category: formData.category.trim() || 'General',
  //       tags: formData.tags,
  //       isPublic: formData.isPublic,
  //       color: formData.color
  //     }
      
  //     console.log('📤 Sending note data:', noteData)
      
  //     // DIRECT API CALL - NO SERVICE FILE
  //     const response = await axios.post('http://localhost:3000/api/notes', noteData, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     })
      
  //     console.log('✅ Note created successfully:', response.data)
  //     toast.success('✨ Note created successfully!')
      
  //     // Reset form
  //     setFormData({
  //       title: '',
  //       content: '',
  //       category: '',
  //       tags: [],
  //       tagInput: '',
  //       isPublic: false,
  //       color: 'bg-gradient-to-br from-blue-50 to-blue-100'
  //     })
      
  //     // Navigate to home page
  //     navigate('/')
      
  //   } catch (error) {
  //     console.error('❌ Error creating note:', error)
      
  //     // Handle specific error responses
  //     if (error.response) {
  //       // Server responded with error status
  //       console.error('Backend error response:', error.response.data)
        
  //       switch (error.response.status) {
  //         case 400:
  //           // Bad Request - show validation errors from backend
  //           const backendErrors = error.response.data.errors || error.response.data.message
  //           if (backendErrors) {
  //             toast.error(`Validation error: ${JSON.stringify(backendErrors)}`)
  //           } else {
  //             toast.error('Invalid data. Please check your inputs.')
  //           }
  //           break
            
  //         case 401:
  //           toast.error('Please log in to create notes')
  //           navigate('/')
  //           break
            
  //         case 409:
  //           toast.error('A note with this title already exists')
  //           break
            
  //         case 500:
  //           toast.error('Server error. Please try again later.')
  //           break
            
  //         default:
  //           toast.error('Failed to create note')
  //       }
  //     } else if (error.request) {
  //       // Request was made but no response
  //       console.error('No response received:', error.request)
  //       toast.error('Network error. Please check your connection.')
  //     } else {
  //       // Something else happened
  //       console.error('Request setup error:', error.message)
  //       toast.error('An unexpected error occurred')
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }
  
  setLoading(true);
  
  try {
    // ⚠️ FIXED: Send only what the backend expects
    const noteData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags,
      // Remove category, isPublic - backend doesn't have these
      // Keep color but transform to hex format
      color: extractHexColor(formData.color) || '#ffffff'
      // favorite and archived will use defaults from schema
    };
    
    console.log('📤 Sending note data:', noteData);
    console.log('📤 JSON string being sent:', JSON.stringify(noteData));
    
    // Add timeout to debug
    const response = await axios.post('http://localhost:3000/api/notes', noteData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Note created successfully:', response.data);
    toast.success('✨ Note created successfully!');
    
    // Reset form
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: [],
      tagInput: '',
      isPublic: false,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100'
    });
    
    // Navigate to home page
    navigate('/');
    
  } catch (error) {
    console.error('❌ Full error object:', error);
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Server might be down.');
    } else if (error.response) {
      console.error('Server error response:', error.response.data);
      
      if (error.response.status === 400) {
        // Check if it's a JSON parse error
        if (error.response.data.error?.includes('Invalid JSON')) {
          console.error('JSON Parse Error! The data sent was:', noteData);
          console.error('JSON string that failed:', JSON.stringify(noteData));
          toast.error('JSON format error. Please check the data being sent.');
        } else {
          toast.error(`Validation error: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        toast.error(`Error ${error.response.status}: ${error.response.data.error || 'Server error'}`);
      }
    } else if (error.request) {
      console.error('No response received. Request:', error.request);
      toast.error('Network error. Check if backend server is running.');
    } else {
      console.error('Error setting up request:', error.message);
      toast.error('Failed to create note');
    }
  } finally {
    setLoading(false);
  }
};
 const extractHexColor = (cssClass) => {
  // Map CSS classes to hex colors
  const colorMap = {
    'bg-gradient-to-br from-blue-50 to-blue-100': '#dbeafe',
    'bg-gradient-to-br from-emerald-50 to-emerald-100': '#d1fae5',
    'bg-gradient-to-br from-purple-50 to-purple-100': '#f3e8ff',
    'bg-gradient-to-br from-amber-50 to-amber-100': '#fef3c7',
    'bg-gradient-to-br from-rose-50 to-rose-100': '#ffe4e6',
    'bg-gradient-to-br from-cyan-50 to-cyan-100': '#cffafe'
  };
  return colorMap[cssClass] || '#ffffff';
};

  // Handle cancel/back
  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('Are you sure? Your changes will be lost.')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <NavBar />
      
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group'
          >
            <FiArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
            Back to Notes
          </button>
          
          <div className='flex items-center gap-4 mb-4'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'>
              <FiFileText className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Create New Note</h1>
              <p className='text-gray-600 mt-2'>Capture your thoughts, ideas, and important information</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
              {/* Form Header */}
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6'>
                <h2 className='text-2xl font-bold text-white'>Note Details</h2>
                <p className='text-blue-100 mt-1'>Fill in the details below</p>
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
                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.title ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400`}
                    placeholder='Enter a captivating title...'
                    disabled={loading}
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
                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.content ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none placeholder:text-gray-400`}
                    placeholder='Start typing your thoughts here...'
                    disabled={loading}
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
                      className='w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all'
                      disabled={loading}
                    >
                      <option value=''>Select category</option>
                      <option value='Personal'>🎯 Personal</option>
                      <option value='Work'>💼 Work</option>
                      <option value='Study'>📚 Study</option>
                      <option value='Ideas'>💡 Ideas</option>
                      <option value='To-Do'>✅ To-Do</option>
                      <option value='Meeting'>👥 Meeting Notes</option>
                      <option value='Project'>🚀 Project</option>
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
                        className='flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all'
                        placeholder='Add a tag...'
                        disabled={loading}
                      />
                      <button
                        type='button'
                        onClick={handleAddTag}
                        disabled={loading}
                        className='px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50'
                      >
                        <FiPlus className='w-5 h-5' />
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
                              className='hover:text-blue-900 transition-colors'
                              disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                      <label
                        htmlFor='isPublic'
                        className={`flex items-center cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      onClick={handleCancel}
                      disabled={loading}
                      className='px-8 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50'
                    >
                      Cancel
                    </button>
                    
                    <button
                      type='submit'
                      disabled={loading}
                      className='px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center'
                    >
                      {loading ? (
                        <>
                          <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent' />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FiSave className='w-5 h-5' />
                          Create Note
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
                          <FiGlobe className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">Public</span>
                        </>
                      ) : (
                        <>
                          <FiLock className="w-4 h-4 text-gray-600" />
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
                  Pro Tips
                </h3>
                <ul className='space-y-3 text-sm text-gray-300'>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5' />
                    <span>Use clear, descriptive titles for better organization</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5' />
                    <span>Add relevant tags to make notes easily searchable</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5' />
                    <span>Choose colors that match the note's mood or category</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5' />
                    <span>Keep public notes professional and share-worthy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNotePage