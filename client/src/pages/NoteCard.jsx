import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';

const NoteCard = ({ note, onToggleFavorite, onDelete }) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(note._id);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(note._id);
  };

  return (
    <Link to={`/edit/${note._id}`}>
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
        <div className={`h-2 ${note.color || 'bg-blue-100'}`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                {note.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleFavoriteClick}
                className={`p-1 rounded-md hover:bg-gray-100 ${note.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Star className="w-4 h-4" fill={note.favorite ? 'currentColor' : 'none'} />
              </button>
              <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
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
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;