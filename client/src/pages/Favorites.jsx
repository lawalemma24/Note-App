import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Archive,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { apiService } from '../services/api';

const Favorites = () => {
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchFavoriteNotes();
  }, []);

  const fetchFavoriteNotes = async () => {
    try {
      setLoading(true);
      const notes = await apiService.getFavoriteNotes();
      setFavoriteNotes(notes);
    } catch (error) {
      console.error('Error fetching favorite notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await apiService.toggleFavorite(id);
      // Remove from favorites list
      setFavoriteNotes(favoriteNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleArchive = async (id) => {
    try {
      await apiService.toggleArchive(id);
      fetchFavoriteNotes(); // Refresh list
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this favorite note?')) {
      try {
        await apiService.deleteNote(id);
        setFavoriteNotes(favoriteNotes.filter(note => note._id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const filteredNotes = favoriteNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading favorite notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/notes"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Favorite Notes</h1>
                  <p className="text-gray-600 mt-2">
                    {favoriteNotes.length} favorite {favoriteNotes.length === 1 ? 'note' : 'notes'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Favorite</span>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{favoriteNotes.length}</div>
              <div className="text-sm text-gray-600">Total Favorites</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Most Tags</div>
          <div className="text-lg font-bold text-gray-900">
            {favoriteNotes.length > 0
              ? [...new Set(favoriteNotes.flatMap(note => note.tags || []))].length
              : 0}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Archived</div>
          <div className="text-lg font-bold text-gray-900">
            {favoriteNotes.filter(note => note.archived).length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Avg. Words</div>
          <div className="text-lg font-bold text-gray-900">
            {favoriteNotes.length > 0
              ? Math.round(favoriteNotes.reduce((sum, note) => sum + (note.content?.split(' ').length || 0), 0) / favoriteNotes.length)
              : 0}
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search favorite notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium"
          >
            All Favorites
          </button>
          <button
            onClick={() => {
              const tags = [...new Set(favoriteNotes.flatMap(note => note.tags || []))];
              if (tags.length > 0) setSearchQuery(tags[0]);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            By Tag
          </button>
          <button
            onClick={() => {
              const archived = favoriteNotes.filter(note => note.archived);
              if (archived.length > 0) setSearchQuery('archived');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Archived Only
          </button>
        </div>
      </div>

      {/* Favorites Grid/List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {favoriteNotes.length === 0 ? 'No favorite notes yet' : 'No matching favorites'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {favoriteNotes.length === 0
              ? 'Star notes to add them to your favorites for quick access'
              : 'Try a different search term'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/notes"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg"
            >
              Browse Notes
            </Link>
            <Link
              to="/create"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Create Note
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => handleToggleFavorite(note._id)}
                  className="p-2 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600"
                >
                  <Star className="w-5 h-5" fill="white" />
                </button>
              </div>
              <div className={`h-3 ${note.color || 'bg-yellow-100'}`} />
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link to={`/edit/${note._id}`} className="hover:text-yellow-600">
                      {note.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(note.updatedAt).toLocaleDateString()} • {note.content?.split(' ').length || 0} words
                  </p>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{note.content}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    {note.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags && note.tags.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                  {note.archived && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/edit/${note._id}`}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleArchive(note._id)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    {note.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {filteredNotes.map((note, index) => (
            <div key={note._id} className={`p-6 ${index !== filteredNotes.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-yellow-50`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleFavorite(note._id)}
                      className="p-2 text-yellow-500 hover:text-yellow-600 mt-1"
                    >
                      <Star className="w-5 h-5" fill="currentColor" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          <Link to={`/edit/${note._id}`} className="hover:text-yellow-600">
                            {note.title}
                          </Link>
                        </h3>
                        {note.archived && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                      <div className="flex items-center gap-4">
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex gap-2">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(note.updatedAt).toLocaleDateString()} • {note.content?.split(' ').length || 0} words
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/edit/${note._id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      {favoriteNotes.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">Tips for Managing Favorites</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Quick Access</h4>
              <p className="text-sm text-gray-600">Favorite notes appear first in search results</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Organization</h4>
              <p className="text-sm text-gray-600">Use tags to categorize your favorite notes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;