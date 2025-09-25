import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Modal 
} from 'react-native';
import { getWeatherIcon, formatDate, capitalizeFirst } from '../utils/helpers';

const ForecastItem = ({ item }) => (
  <View style={styles.forecastItem}>
    <View style={styles.dateContainer}>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
    
    <View style={styles.weatherContainer}>
      <Text style={styles.forecastIcon}>
        {getWeatherIcon(item.icon)}
      </Text>
      <Text style={styles.condition}>
        {capitalizeFirst(item.description)}
      </Text>
    </View>
    
    <View style={styles.tempContainer}>
      <Text style={styles.tempHigh}>{item.temp_max}°</Text>
      <Text style={styles.tempLow}>{item.temp_min}°</Text>
    </View>
  </View>
);

const SortModal = ({ visible, onClose, onSort, currentSort }) => {
  const sortOptions = [
    { key: 'date', label: 'Date', icon: '📅' },
    { key: 'temp_asc', label: 'Temperature (Low to High)', icon: '🌡️' },
    { key: 'temp_desc', label: 'Temperature (High to Low)', icon: '🌡️' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort Forecast</Text>
          
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                currentSort === option.key && styles.selectedOption
              ]}
              onPress={() => {
                onSort(option.key);
                onClose();
              }}
            >
              <Text style={styles.sortIcon}>{option.icon}</Text>
              <Text style={[
                styles.sortLabel,
                currentSort === option.key && styles.selectedLabel
              ]}>
                {
                option.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ForecastList = ({ forecast, onSort, sortBy }) => {
  const [showSortModal, setShowSortModal] = React.useState(false);

  if (!forecast || forecast.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No forecast data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>5-Day Forecast</Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>Sort 📊</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={forecast} // ✅ pass filtered list, not raw forecast
        keyExtractor={(item, index) => `forecast-${index}-${item.date}`}
        renderItem={({ item }) => <ForecastItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSort={onSort}
        currentSort={sortBy}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  forecastItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weatherContainer: {
    flex: 2,
    alignItems: 'center',
  },
  forecastIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  condition: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tempContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tempHigh: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tempLow: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
  },
  sortIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sortLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedLabel: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default ForecastList;