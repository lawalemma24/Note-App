import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Stats = () => {
  const { urlPath } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/statistic/${urlPath}`);
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, [urlPath]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className='justify-center flex text-white underline font-serif p-4 '>Statistics for: {urlPath}</h2>
      <div className="card mb-3">
          <h5 className=" text-3xl text-white f underline font-serif justify-center flex">URL Information</h5>
          <section className=' bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-4'>
            <p className='text-2xl text-white' > Original URL: {stats.originalUrl}</p>
            <p className='text-2xl text-white'>Short URL:  {stats.shortUrl}</p>
            <p className='text-2xl text-white'>Created at: {new Date(stats.createdAt).toLocaleString()}</p>
            <p className='text-2xl text-white'>Total clicks: {stats.totalClicks}</p>
            <h4 className='text-2xl text-white justify-center rounded-2xl bg-green-500 flex'>Recent Accesses..</h4>
            <ul className="list-group">
                {stats.recentAccesses.map((access, index) => (
                  <li key={index} className="list-group-item">
                   
                      <p className='text-2xl text-white'>Time: {new Date(access.accessedAt).toLocaleString()} </p>
                  
                      <p className='text-2xl text-white'>IP: {access.ipAddress} </p>
                    
                  
                      <p className='text-2xl text-white'>Browser: {access.userAgent} </p>
                    
                  </li>
                ))}
              </ul>
              <h5 className="card-title text-2xl text-white font-serif">Browser Usage</h5>
              <ul className="list-group text-2xl text-white font-serif">
                {stats.browserStats.map((browser, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{browser._id || 'Unknown'}</span>
                    <span className="badge bg-primary rounded-pill">{browser.count}</span>
                  </li>
                ))}
              </ul>
              
       

            <h5 className="card-title text-white">Hourly Usage</h5>
          <div style={{ height: '300px' }}>
            {/* This would be better with a chart library like Chart.js */}
            <div className="d-flex align-items-end" style={{ height: '250px' }}>
              {stats.hourlyStats.map((hour) => (
                <div
                  key={hour._id}
                  className="d-flex flex-column align-items-center mx-1"
                  style={{ width: '30px' }}
                >
                  <div
                    style={{
                      height: `${(hour.count / Math.max(...stats.hourlyStats.map(h => h.count))) * 200}px`,
                      width: '20px',
                      backgroundColor: '#0d6efd',
                    }}
                  ></div>
                  <small>{hour._id}:00</small>
                  <small>{hour.count}</small>
                </div>
              ))}
              </div>
              </div>
            </section>

      </div>

     
              </div>
     )}
           

export default Stats;