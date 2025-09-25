import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as Location from 'expo-location';
import { weatherAPI } from '../services/weatherAPI';
import { processForecastData } from '../utils/helpers';

const WeatherContext = createContext();

const initialState = {
  location: null,
  currentWeather: null,
  forecast: [],
  filteredForecast: [],
  loading: false,
  error: null,
  sortBy: 'date',
  locationPermission: null
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload };
    case 'SET_FORECAST':
      return { 
        ...state, 
        forecast: action.payload,
        filteredForecast: action.payload 
      };
    case 'SET_FILTERED_FORECAST':
      return { ...state, filteredForecast: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_LOCATION_PERMISSION':
      return { ...state, locationPermission: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      dispatch({ type: 'SET_LOCATION_PERMISSION', payload: status });
      return status === 'granted';
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Permission request failed' });
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      dispatch({ type: 'SET_LOCATION', payload: location });
      return location;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchWeatherData = async () => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'SET_LOADING', payload: true });

      const location = await getCurrentLocation();
      const { latitude, longitude } = location.coords;

      const [currentWeather, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeather(latitude, longitude),
        weatherAPI.getForecast(latitude, longitude)
      ]);

      dispatch({ type: 'SET_CURRENT_WEATHER', payload: currentWeather });
      
      const processedForecast = processForecastData(forecastData.list);
      dispatch({ type: 'SET_FORECAST', payload: processedForecast });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

const sortForecast = (sortBy) => {
  dispatch({ type: 'SET_SORT_BY', payload: sortBy });

  const sorted = [...state.forecast].sort((a, b) => {
    switch (sortBy) {
      case 'temp_asc':
        return a.temp_max - b.temp_max;   // low → high
      case 'temp_desc':
        return b.temp_max - a.temp_max;   // high → low
      case 'date':
      default:
        return new Date(a.date) - new Date(b.date);
    }
  });

  dispatch({ type: 'SET_FILTERED_FORECAST', payload: sorted });
};



  useEffect(() => {
    fetchWeatherData();
  }, []);

  const value = {
    ...state,
    fetchWeatherData,
    sortForecast,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
};