import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const productTypes = [
  { id: 'panel', i18nKey: 'PRODUCT_TYPES.PANEL' },
  { id: 'inverter', i18nKey: 'PRODUCT_TYPES.INVERTER' },
  { id: 'battery', i18nKey: 'PRODUCT_TYPES.BATTERY' },
  { id: 'accessory', i18nKey: 'PRODUCT_TYPES.ACCESSORY' }
];

const conditions = [
  { id: 'new', i18nKey: 'CONDITIONS.NEW' },
  { id: 'used', i18nKey: 'CONDITIONS.USED' },
  { id: 'needsRepair', i18nKey: 'CONDITIONS.NEEDS_REPAIR' }
];

const governorates = [
  { id: 'sanaa', i18nKey: 'GOVERNORATES.SANAA' },
  { id: 'aden', i18nKey: 'GOVERNORATES.ADEN' },
  { id: 'taiz', i18nKey: 'GOVERNORATES.TAIZ' },
  { id: 'hodeidah', i18nKey: 'GOVERNORATES.HODEIDAH' },
  { id: 'hadramout', i18nKey: 'GOVERNORATES.HADRAMOUT' }
];


export default function MarketplaceFilter({ visible, onClose, onApply }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    productType: '',
    condition: '',
    priceRange: [0, 1000000],
    governorate: '',
    showVerified: false,
    searchQuery: ''
  });

  const toggleVerified = () =>
    setFilters({ ...filters, showVerified: !filters.showVerified });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('COMMON.FILTERS')}</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() =>
              setFilters({
                productType: '',
                condition: '',
                priceRange: [0, 1000000],
                governorate: '',
                showVerified: false,
                searchQuery: ''
              })
            }
          >
            <Text style={styles.resetText}>{t('COMMON.RESET')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Search Input */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('COMMON.SEARCH')}</Text>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('MARKETPLACE.SEARCH_PLACEHOLDER')}
                placeholderTextColor="#9CA3AF"
                value={filters.searchQuery}
                onChangeText={(text) => setFilters({ ...filters, searchQuery: text })}
              />
            </View>
          </View>

          {/* Product Type */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('MARKETPLACE.PRODUCT_TYPE')}</Text>
            <View style={styles.optionsContainer}>
              {productTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optionButton,
                    filters.productType === type.id && styles.selectedOption
                  ]}
                  onPress={() => setFilters({ ...filters, productType: type.id })}
                >
                  <Text style={[
                    styles.optionText,
                    filters.productType === type.id && styles.selectedOptionText
                  ]}>
                    {t(type.i18nKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condition */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('MARKETPLACE.CONDITION')}</Text>
            <View style={styles.optionsContainer}>
              {conditions.map((cond) => (
                <TouchableOpacity
                  key={cond.id}
                  style={[
                    styles.optionButton,
                    filters.condition === cond.id && styles.selectedOption
                  ]}
                  onPress={() => setFilters({ ...filters, condition: cond.id })}
                >
                  <Text style={[
                    styles.optionText,
                    filters.condition === cond.id && styles.selectedOptionText
                  ]}>
                    {t(cond.i18nKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('MARKETPLACE.PRICE_RANGE')}</Text>
            <View style={styles.sliderContainer}>
              <Slider
                minimumValue={0}
                maximumValue={1000000}
                step={50000}
                value={filters.priceRange[0]}
                onValueChange={(value) =>
                  setFilters({ ...filters, priceRange: [value, filters.priceRange[1]] })
                }
                minimumTrackTintColor="#16A34A"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#16A34A"
              />
              <View style={styles.priceRangeText}>
                <Text style={styles.priceText}>{filters.priceRange[0].toLocaleString()}</Text>
                <Text style={styles.priceText}>{filters.priceRange[1].toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Governorate */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('MARKETPLACE.GOVERNORATE')}</Text>
            <View style={styles.optionsContainer}>
              {governorates.map((gov) => (
                <TouchableOpacity
                  key={gov.id}
                  style={[
                    styles.optionButton,
                    filters.governorate === gov.id && styles.selectedOption
                  ]}
                  onPress={() => setFilters({ ...filters, governorate: gov.id })}
                >
                  <Text style={[
                    styles.optionText,
                    filters.governorate === gov.id && styles.selectedOptionText
                  ]}>
                    {t(gov.i18nKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Verified Only */}
          <View style={styles.filterSection}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{t('MARKETPLACE.SHOW_VERIFIED')}</Text>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#16A34A" }}
                thumbColor="#FFFFFF"
                value={filters.showVerified}
                onValueChange={toggleVerified}
              />
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => onApply(filters)}
        >
          <Text style={styles.applyButtonText}>{t('COMMON.APPLY_FILTERS')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#111827',
  },
  resetButton: {
    padding: 8,
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#16A34A',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#111827',
    textAlign: 'right',
  },
  optionsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#16A34A',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#4B5563',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  priceRangeText: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#4B5563',
  },
  switchContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#111827',
  },
  applyButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
  },
});