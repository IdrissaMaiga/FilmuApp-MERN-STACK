import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext'; 
import Login from './components/Login';
import Register from './components/Register';
import VideoPlayer from './components/VideoPlayer';
import VideoForm from './components/VideoForm'; 
import Navbar from './components/Navbar';
import ChannelFilterPage from './components/ChannelFilterPage';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {!user ? (
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='*' element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path='/stream/:id' element={<VideoPlayerWrapper />} />
              <Route path='/video-form' element={<VideoForm />} />
              <Route path='/channels' element={<ChannelFilterPage />} /> 
              <Route path='*' element={<Navigate to="/channels" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

const VideoPlayerWrapper = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataType = queryParams.get('dataType') || 'defaultDataType';

  return <VideoPlayer channelId={id} dataType={dataType} />;
};

export default App;
