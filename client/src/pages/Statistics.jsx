import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  FileText,
  Tag,
  Star,
  Archive,
  Download,
  Filter,
  ChevronDown,
  Users,
  Clock,
  Award,
  Target,
  Zap,
  BarChart,
  LineChart,
  PieChart as PieChartIcon
} from 'lucide-react';
import { apiService } from '../services/api';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [tagStats, setTagStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [overviewData, tagsData, activityData, detailedData] = await Promise.all([
        apiService.getOverviewStats(),
        apiService.getTagStats(),
        apiService.getActivity(),
        apiService.getDetailedStats(),
      ]);
      
      setStats(overviewData);
      setTagStats(tagsData);
      setActivity(activityData);
      setDetailedStats(detailedData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportStatistics = () => {
    const dataStr = JSON.stringify({
      overview: stats,
      tagDistribution: tagStats,
      activity: activity,
      detailed: detailedStats,
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `thinkboard-stats-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!stats || !tagStats) return { tagData: [], productivityData: [] };

    // Tag distribution data
    const tagData = Object.entries(tagStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Productivity data (mock - would come from detailed stats)
    const productivityData = [
      { day: 'Mon', notes: 3, words: 1200 },
      { day: 'Tue', notes: 5, words: 1800 },
      { day: 'Wed', notes: 2, words: 800 },
      { day: 'Thu', notes: 6, words: 2200 },
      { day: 'Fri', notes: 4, words: 1500 },
      { day: 'Sat', notes: 1, words: 400 },
      { day: 'Sun', notes: 3, words: 1100 },
    ];

    return { tagData, productivityData };
  };

  const { tagData, productivityData } = prepareChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Deep insights into your note-taking habits</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <button
              onClick={exportStatistics}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Total Notes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalNotes || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Favorites</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.favorites || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Archive className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Archived</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.archived || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Tag className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500">Tags</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.categories || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Words</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalWords ? (stats.totalWords / 1000).toFixed(1) + 'k' : 0}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500">Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Productivity Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Productivity</h3>
              <p className="text-gray-600 text-sm">Notes created and words written per day</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
              >
                <BarChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
              >
                <LineChart className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <RechartsBarChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="notes" fill="#8884d8" name="Notes Created" />
                  <Bar dataKey="words" fill="#82ca9d" name="Words Written" />
                </RechartsBarChart>
              ) : (
                <RechartsLineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="notes" stroke="#8884d8" strokeWidth={2} name="Notes Created" />
                  <Line type="monotone" dataKey="words" stroke="#82ca9d" strokeWidth={2} name="Words Written" />
                </RechartsLineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tag Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tag Distribution</h3>
              <p className="text-gray-600 text-sm">Most frequently used tags</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={tagData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tagData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} notes`, 'Count']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {tagData.map((tag, index) => (
              <div key={tag.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-700 truncate">{tag.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">{tag.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600 text-sm">Latest actions on your notes</p>
          </div>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {activity.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  <span className="font-medium">{item.user}</span> {item.action} "{item.target}"
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.time).toLocaleDateString()} at {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Performance Metrics</h3>
              <p className="text-purple-100 text-sm">Your note-taking efficiency</p>
            </div>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Note Length</span>
              <span className="font-bold">
                {stats && stats.totalNotes > 0 ? Math.round(stats.totalWords / stats.totalNotes) : 0} words
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Favorite Rate</span>
              <span className="font-bold">
                {stats && stats.totalNotes > 0 ? Math.round((stats.favorites / stats.totalNotes) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Archive Rate</span>
              <span className="font-bold">
                {stats && stats.totalNotes > 0 ? Math.round((stats.archived / stats.totalNotes) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Weekly Growth</span>
              <span className="font-bold text-green-300">+{stats?.weeklyGrowth || 0}%</span>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">How You Compare</h3>
              <p className="text-gray-600 text-sm">Vs. average users</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Notes Created</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{stats?.totalNotes || 0}</span>
                <span className="text-sm text-gray-500">vs 24 avg</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Tags Used</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{stats?.categories || 0}</span>
                <span className="text-sm text-gray-500">vs 8 avg</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Consistency</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{stats?.streak || 0} days</span>
                <span className="text-sm text-gray-500">vs 3 days avg</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Words/Day</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {stats && stats.streak > 0 ? Math.round(stats.totalWords / (stats.streak * 7)) : 0}
                </span>
                <span className="text-sm text-gray-500">vs 150 avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900">Improve Tagging</h4>
            </div>
            <p className="text-gray-600 text-sm">
              You're using {stats?.categories || 0} tags. Consider creating more specific tags for better organization.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900">Increase Consistency</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Your {stats?.streak || 0}-day streak is great! Try to write at least 200 words daily.
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Archive className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900">Archive Old Notes</h4>
            </div>
            <p className="text-gray-600 text-sm">
              You have {stats?.archived || 0} archived notes. Consider reviewing and archiving older notes monthly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;