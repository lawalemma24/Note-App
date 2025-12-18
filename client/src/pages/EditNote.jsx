import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save,
  X,
  Tag,
  Palette,
  Star,
  Archive,
  Trash2,
  Clock,
  Copy,
  Share2,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { apiService } from '../services/api';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#ffffff',
    favorite: false,
    archived: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [noteHistory, setNoteHistory] = useState([]);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const note = await apiService.getNoteById(id);
      setFormData({
        title: note.title || '',
        content: note.content || '',
        tags: note.tags || [],
        color: note.color || '#ffffff',
        favorite: note.favorite || false,
        archived: note.archived || false,
      });
      
      // Mock history data
      setNoteHistory([
        { date: new Date(note.updatedAt), action: 'Last edited' },
        { date: new Date(note.createdAt), action: 'Created' },
      ]);
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Note not found!');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setSaving(true);
    try {
      await apiService.updateNote(id, formData);
      navigate(`/notes`);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await apiService.deleteNote(id);
        navigate('/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const updatedNote = await apiService.toggleFavorite(id);
      setFormData(prev => ({ ...prev, favorite: updatedNote.favorite }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleArchive = async () => {
    try {
      const updatedNote = await apiService.toggleArchive(id);
      setFormData(prev => ({ ...prev, archived: updatedNote.archived }));
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const colors = [
    '#ffffff', '#fef3c7', '#dbeafe', '#d1fae5', '#f3e8ff',
    '#ffe4e6', '#f0f9ff', '#fefce8', '#f0fdf4'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/notes"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
              <p className="text-gray-600 mt-2">Make changes to your note</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg hover:bg-gray-100 ${formData.favorite ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <Star className="w-5 h-5" fill={formData.favorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleToggleArchive}
              className={`p-2 rounded-lg hover:bg-gray-100 ${formData.archived ? 'text-purple-600' : 'text-gray-400'}`}
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Editing Note</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {noteHistory[0] && noteHistory[0].date.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                    required
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-96 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.tags.length} tags
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add tags (press Enter)"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full"
                        >
                          <span className="text-sm">{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="p-0.5 hover:bg-purple-200 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note Color
                  </label>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg border-2 ${formData.color === color ? 'border-purple-500' : 'border-gray-200'} hover:border-purple-300`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
            <div
              className="p-6 rounded-lg border-2 border-gray-200"
              style={{ backgroundColor: formData.color }}
            >
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {formData.title || 'Note Title'}
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.content || 'Note content will appear here...'}
                </p>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-white/50 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200">
                {formData.favorite && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                    ⭐ Favorite
                  </span>
                )}
                {formData.archived && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    📦 Archived
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Note History */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Note History</h3>
            <div className="space-y-4">
              {noteHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{history.action}</p>
                    <p className="text-sm text-gray-500">
                      {history.date.toLocaleDateString()} at {history.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigator.clipboard.writeText(`${formData.title}\n\n${formData.content}`)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Copy to Clipboard</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Share Note</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export as PDF</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">View Analytics</span>
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Note Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Favorite</span>
                <span className={`px-2 py-1 text-xs rounded ${formData.favorite ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                  {formData.favorite ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Archived</span>
                <span className={`px-2 py-1 text-xs rounded ${formData.archived ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                  {formData.archived ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Word Count</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {formData.content?.split(' ').length || 0} words
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Last Updated</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {noteHistory[0] ? noteHistory[0].date.toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNote;