import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [decodedUrl, setDecodedUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/encode', {
        originalUrl,
      });
      setShortUrl(res.data.shortUrl);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error shortening URL');
    }
  };

  const handleDecode = async () => {
    if (!shortUrl) return;
    try {
      const res = await axios.get('http://localhost:5000/api/decode', {
        params: { shortUrl },
      });
      setDecodedUrl(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error decoding URL');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center  bg-gray-700 text-white rounded-lg shadow-lg p-5 max-w-md w-full bg-opacity-50 backdrop-filter backdrop-blur-xl '>
      <h2 className=' bg-gradient-to-r p-2 from-green-500 to-emerald-600 text-white rounded-lg'>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="originalUrl" className="form-label font-serif">Enter Original URL</label>
          <input
            type="url"
            className="form-control  w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <motion.button className="mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white
        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
        focus:ring-offset-gray-900 transition duration-200"
           type = "submit" >Shorten URL</motion.button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {shortUrl && (
        <div className="mt-3">
          <h4 className='underline flex justify-center font-bold text-blue-200'>Short URL:</h4>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              value={shortUrl}
              readOnly
            />
            <button
              className="btn btn-secondary ms-2 motion.button mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white
        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
        focus:ring-offset-gray-900 transition "
           type = "submit"
              onClick={() => navigator.clipboard.writeText(shortUrl)}
            >
              Copy
            </button>
            <button
              className="btn btn-info ms-2 btn btn-secondary ms-2 motion.button mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white
        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
        focus:ring-offset-gray-900 transition "
           type = "submit"
              onClick={handleDecode}
            >
              Decode
            </button>
          </div>
        </div>
      )}

      {decodedUrl && (
        <div className="mt-3">
          <h4 className='justify-center flex underline text-blue-400 font-bold'>Decoded URL:</h4>
          <p className=''>Original: {decodedUrl.originalUrl}</p>
          <p>Short: {decodedUrl.shortUrl}</p>
          <a
            href={`/stats/${decodedUrl.urlPath}`}
            className="btn btn-success underline mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white
        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 justify-center flex"
          >
            View Statistics
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;