import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getWeatherIcon, capitalizeFirst } from '../utils/helpers';

const WeatherCard = ({ weather, location }) => {
  if (!weather) return null;

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.cityName}>{weather.name}</Text>
        <Text style={styles.country}>{weather.sys.country}</Text>
      </View>
      
      <View style={styles.weatherInfo}>
        <Text style={styles.icon}>
          {getWeatherIcon(weather.weather[0].icon)}
        </Text>
        <Text style={styles.temperature}>
          {Math.round(weather.main.temp)}°C
        </Text>
        <Text style={styles.description}>
          {capitalizeFirst(weather.weather[0].description)}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Feels like</Text>
          <Text style={styles.detailValue}>
            {Math.round(weather.main.feels_like)}°C
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>
            {Math.round(weather.wind.speed * 3.6)} km/h
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  country: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default WeatherCard;