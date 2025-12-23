import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Star, 
  Archive, 
  TrendingUp, 
  Clock, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { apiService } from '../services/api';
import NoteCard from '../pages/NoteCard.jsx';
import StatsCard from '../pages/StatCards.jsx';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [notesData, statsData] = await Promise.all([
        apiService.getAllNotes({ limit: 6 }),
        apiService.getOverviewStats(),
      ]);
      setNotes(notesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard datas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiService.deleteNote(id);
        setNotes(notes.filter(note => note._id !== id));
        fetchDashboardData(); // Refresh stats
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await apiService.toggleFavorite(id);
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your note overview.</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Notes"
            value={stats.totalNotes}
            icon={FileText}
            color="blue"
            trend={stats.weeklyGrowth}
          />
          <StatsCard
            title="Favorites"
            value={stats.favorites}
            icon={Star}
            color="purple"
            percentage={Math.round((stats.favorites / stats.totalNotes) * 100)}
          />
          <StatsCard
            title="Archived"
            value={stats.archived}
            icon={Archive}
            color="green"
            percentage={Math.round((stats.archived / stats.totalNotes) * 100)}
          />
          <StatsCard
            title="Current Streak"
            value={stats.streak}
            icon={TrendingUp}
            color="orange"
            unit="days"
          />
        </div>
      )}

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search recent notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Note</span>
          </Link>
          <Link
            to="/notes"
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Notes</h2>
          <p className="text-gray-600 text-sm">Your most recently created or updated notes</p>
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotes.map((note) => (
              <div key={note._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        <Link to={`/edit/${note._id}`} className="hover:text-purple-600">
                          {note.title}
                        </Link>
                      </h3>
                      {note.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {note.archived && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{note.content}</p>
                    <div className="flex items-center gap-4">
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-2">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              +{note.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(note.updatedAt).toLocaleDateString()}
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
                      onClick={() => handleDeleteNote(note._id)}
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
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">
                  {(stats.totalWords / 1000).toFixed(1)}k
                </div>
                <div className="text-sm opacity-90">Words Written</div>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-sm">
              Average: {stats.totalNotes > 0 ? Math.round(stats.totalWords / stats.totalNotes) : 0} words/note
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-sm opacity-90">Categories</div>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-sm">
              {stats.totalNotes > 0 ? Math.round(stats.categories / stats.totalNotes * 100) : 0}% tag usage
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-sm">
              Keep going! You're on a roll
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;