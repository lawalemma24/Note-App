import React from 'react';
import { Tag } from 'lucide-react';

const TagCloud = ({ tags, onTagClick, maxTags = 20 }) => {
  // Sort tags by frequency or alphabetically
  const sortedTags = Object.entries(tags || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxTags);

  const getSizeClass = (count, maxCount) => {
    const percentage = count / maxCount;
    if (percentage > 0.8) return 'text-lg px-4 py-2';
    if (percentage > 0.6) return 'text-base px-3 py-1.5';
    if (percentage > 0.4) return 'text-sm px-3 py-1';
    return 'text-xs px-2 py-1';
  };

  const getColorClass = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-green-100 text-green-800 hover:bg-green-200',
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'bg-red-100 text-red-800 hover:bg-red-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ];
    return colors[index % colors.length];
  };

  const maxCount = sortedTags.length > 0 ? Math.max(...sortedTags.map(([, count]) => count)) : 1;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Tag Cloud</h3>
      </div>
      {sortedTags.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tags yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tagName, count], index) => (
            <button
              key={tagName}
              onClick={() => onTagClick && onTagClick(tagName)}
              className={`${getSizeClass(count, maxCount)} ${getColorClass(index)} rounded-full font-medium transition-colors flex items-center gap-1`}
            >
              <span>{tagName}</span>
              <span className="text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{Object.keys(tags || {}).length}</span> unique tags •{' '}
          <span className="font-medium">{Object.values(tags || {}).reduce((a, b) => a + b, 0)}</span> total uses
        </div>
      </div>
    </div>
  );
};

export default TagCloud;