import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/list');
        setUrls(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching URLs');
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className='mt-5 text-4xl text-white rounded-2xl bg-green-500 justify-center flex '>All Shortened URLs</h1>
      <table className="table table-striped">
        <thead >
          <tr className='text-2xl text-white font-serif justify-between p-5  gap-10'> 
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-white'>
          {urls.map((url) => (
            <tr key={url._id}>
              <td className='p-5 '>
                <a href={url.shortUrl} target=" _blank" rel="noopener noreferrer">
                  {url.shortUrl}
                </a>
              </td>
              <td className="text-truncate" style={{ maxWidth: '200px' }}>
                {url.originalUrl}
              </td>
              <td>{url.clicks}</td>
              <td>{new Date(url.createdAt).toLocaleDateString()}</td>
              <td>
                <Link
                  to={`/stats/${url.urlPath}`}
                  className="btn btn-sm btn-info"
                >
                  Stats
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlList;