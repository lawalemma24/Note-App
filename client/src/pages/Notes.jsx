import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Star,
  Archive,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { apiService } from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState('all'); // all, favorites, archived

  useEffect(() => {
    fetchNotes();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let params = {};
      
      if (filter === 'favorites') {
        params.favorite = 'true';
      } else if (filter === 'archived') {
        params.archived = 'true';
      }
      
      const data = await apiService.getAllNotes(params);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiService.deleteNote(id);
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await apiService.toggleFavorite(id);
      fetchNotes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await apiService.toggleArchive(id);
      fetchNotes();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Filter notes based on search and selected tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       (note.tags && selectedTags.some(tag => note.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Notes</h1>
        <p className="text-gray-600 mt-2">
          {notes.length} notes • {filteredNotes.length} matching
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* View Toggle */}
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

          {/* Create Button */}
          <Link
            to="/create"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Note
          </Link>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'favorites'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Favorites
            </div>
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'archived'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Archived
            </div>
          </button>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid/List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedTags.length > 0 || filter !== 'all'
              ? 'Try changing your filters or search term'
              : 'Create your first note to get started'}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            Create Note
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-2 ${note.color || 'bg-blue-100'}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      <Link to={`/edit/${note._id}`} className="hover:text-purple-600">
                        {note.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(note._id)}
                      className={`p-1 rounded-md ${
                        note.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={note.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-1 rounded-md text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {note.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
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
                  <div className="flex items-center gap-2">
                    {note.archived && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/edit/${note._id}`}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleArchive(note._id)}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    {note.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
          {filteredNotes.map((note) => (
            <div key={note._id} className="p-6 border-b border-gray-200 hover:bg-gray-50 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link to={`/edit/${note._id}`} className="hover:text-purple-600">
                        {note.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2">
                      {note.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {note.archived && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{note.content}</p>
                  <div className="flex items-center gap-4">
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-sm text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleFavorite(note._id)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${
                      note.favorite ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={note.favorite ? 'currentColor' : 'none'} />
                  </button>
                  <Link
                    to={`/edit/${note._id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredNotes.length > 0 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;