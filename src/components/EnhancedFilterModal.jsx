// src/components/EnhancedFilterModal.jsx
import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function EnhancedFilterModal({ visible, onClose, onApply }) {
  const [filters, setFilters] = useState({
    productType: '',
    condition: '',
    priceRange: [0, 10000],
    showVerified: false,
    showUserListings: true
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>فلترة السوق</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>

          {/* Add your filter input fields here */}

          <View style={styles.footer}>
            <Button title="تطبيق الفلاتر" onPress={() => onApply(filters)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  cancelText: {
    color: 'red',
    fontSize: 16
  },
  footer: {
    marginTop: 20
  }
});
