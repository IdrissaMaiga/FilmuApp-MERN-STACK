import axios from 'axios'
import { baseurl } from '../context/authProvider'

import { streamingserverurl } from '../context/authProvider'
export const imagePath = 'https://image.tmdb.org/t/p/w500'
export const imagePathOriginal = 'https://image.tmdb.org/t/p/original'

const baseUrl = 'https://api.themoviedb.org/3'
const apiKey = "91f480a74749344a6e1b15f5ead2cb12"

// TRENDING
export const fetchTrending = async (timeWindow = 'day') => {
  const { data } = await axios.get(
    `${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}&language=fr-FR`
  )

  return data?.results
}

export const fetchgenre = async (type) => { 
  const res = await axios.get(
    `${baseUrl}/genre/${type}/list?api_key=${apiKey}` 
  );
  return res?.data;
};

// MOVIES & SERIES - Details

export const fetchDetails = async (type, id) => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}?api_key=${apiKey}&language=fr-FR`
  )
  return res?.data
}


export const getSerieInfo = async (serieId) => {
  
  const res = await axios.get(`${streamingserverurl}/serieinfo/${encodeURIComponent(`${serieId}`)}`);

  return res.data;
};






// MOVIES & SERIES - Credits

export const fetchCredits = async (type, id) => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/credits?api_key=${apiKey}&language=fr-FR`
  )
  return res?.data
}

// MOVIES & SERIES - Videos

export const fetchVideos = async (type, id) => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/videos?api_key=${apiKey}&language=fr-FR`
  )
  return res?.data
}

export const fetchdata = async (page, pageSize = 24, type, random,genre) => {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`${baseurl}/api/${type}`, {headers: { Authorization: `Bearer ${token}` },
    params: { page, pageSize, random,genre},
   // withCredentials: true,
  });
  
  return res.data;
};

export const searchall = async ({ page, pageSize, search, random, type }) => {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`${baseurl}/api/series/all`, {headers: { Authorization: `Bearer ${token}` },
    params: { page, pageSize, search, random, type },
   // withCredentials: true,
  });
  return res.data;
};



export const fetchTvSeries = async (page, sortBy) => {
  const res = await axios.get(
    `${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sortBy}&language=fr-FR`
  )
  return res?.data
}

// SEARCH

export const searchData = async (query, page) => {
  const res = await axios.get(
    `${baseUrl}/search/multi?api_key=${apiKey}&query=${query}&page=${page}&language=fr-FR`
  )
  return res?.data
}


export const fetchEpisodeDetails = async (seriesId, seasonNumber, episodeNumber) => {
  const res = await axios.get(
    `${baseUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}&language=fr-FR`
  );
  return res?.data;
};




export const fetchWatchingData = async ({ movieIds, seriesIds }) => {
  try {
    
    const token = localStorage.getItem('accessToken');
    // Send a POST request with the IDs of movies and series
    const response = await axios.post(`${baseurl}/api/series/byids`, 
      { movieIds, seriesIds }
    ,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.error("Error fetching watching data:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};


