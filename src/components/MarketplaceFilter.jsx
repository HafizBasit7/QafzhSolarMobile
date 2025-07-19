import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ar from '../locales/ar';

export default function MarketplaceFilter({ visible, onClose, onApply }) {
  const [filters, setFilters] = useState({
    productType: '',
    condition: '',
    priceRange: [0, 1000000],
    governorate: '',
    showVerified: false,
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{ar.COMMON.FILTERS}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>{ar.COMMON.CANCEL}</Text>
          </TouchableOpacity>
        </View>

        {/* You can add filter UI elements here inside ScrollView if needed */}
        <ScrollView style={styles.filterContent}>
          {/* Place filter options here */}
          <Text style={styles.placeholder}>Filter controls go here</Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => onApply(filters)}
        >
          <Text style={styles.applyButtonText}>{ar.COMMON.APPLY}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  closeText: {
    fontSize: 16,
    color: '#888',
  },
  filterContent: {
    flex: 1,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
