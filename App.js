import React from 'react';
import { 
  View, 
  StyleSheet, 
  RefreshControl, 
  ScrollView,
  Dimensions,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const WeatherApp = () => {
  //  const insets = useSafeAreaInsets();
  const { 
    currentWeather, 
    filteredForecast, 
    loading, 
    error, 
    sortBy,
    fetchWeatherData, 
    sortForecast 
  } = useWeather();

  const [screenData, setScreenData] = React.useState(Dimensions.get('window'));
  const [orientation, setOrientation] = React.useState('portrait');

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });


    ScreenOrientation.unlockAsync();

    return () => subscription?.remove();
  }, []);

  const onRefresh = React.useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  if (loading && !currentWeather) {
    return <LoadingSpinner />;
  }
console.log("error",error);
console.log("error",currentWeather);
  if (error && !currentWeather) {
    return <ErrorMessage error={error} onRetry={fetchWeatherData} />;
  }

  const isLandscape = orientation === 'landscape';

  return (
<View style={styles.container}>
        {isLandscape ? (
        <View style={styles.landscapeContainer}>
          <ScrollView 
            style={styles.weatherSection}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
          >
            <WeatherCard weather={currentWeather} />
          </ScrollView>
          <View style={styles.forecastSection}>
            <ForecastList 
              forecast={filteredForecast} 
              onSort={sortForecast}
              sortBy={sortBy}
            />
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.portraitContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          <WeatherCard weather={currentWeather} />
          <View style={styles.forecastContainer}>
            <ForecastList 
              forecast={filteredForecast} 
              onSort={sortForecast}
              sortBy={sortBy}
            />
          </View>
        </ScrollView>
      )}
</View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar style="dark" />
          <WeatherApp />
        </SafeAreaView>
      </WeatherProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  portraitContainer: {
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  weatherSection: {
    flex: 1,
    minWidth: 300,
  },
  forecastSection: {
    flex: 1,
    minWidth: 300,
  },
  forecastContainer: {
    flex: 1,
    minHeight: 400,
  },
});

export default App;