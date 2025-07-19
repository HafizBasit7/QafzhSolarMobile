import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import ar from '../locales/ar';

const productTypes = [
  'ألواح شمسية',
  'انفرتر',
  'بطارية',
  'شاحن',
  'ملحقات'
];

const conditions = [
  { id: 'new', label: 'جديد' },
  { id: 'used', label: 'مستعمل' },
  { id: 'needs_repair', label: 'يحتاج إصلاح' }
];

const governorates = [
  'صنعاء', 'عدن', 'تعز', 'حضرموت', 'المكلا', 
  'إب', 'ذمار', 'الحديدة', 'عمران', 'صعدة'
];

export default function FilterScreen() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState({
    productType: '',
    condition: '',
    priceRange: [0, 10000000],
    governorate: '',
    showVerified: false,
    showUserListings: true
  });

  const applyFilters = () => {
    navigation.navigate('MarketplaceTab', { 
      filters,
      screen: 'Marketplace' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{ar.COMMON.FILTERS}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>{ar.COMMON.CANCEL}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>نوع المنتج</Text>
          <View style={styles.optionsContainer}>
            {productTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  filters.productType === type && styles.selectedOption
                ]}
                onPress={() => setFilters({...filters, productType: type})}
              >
                <Text style={[
                  styles.optionText,
                  filters.productType === type && styles.selectedOptionText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>حالة المنتج</Text>
          <View style={styles.optionsContainer}>
            {conditions.map(cond => (
              <TouchableOpacity
                key={cond.id}
                style={[
                  styles.optionButton,
                  filters.condition === cond.id && styles.selectedOption
                ]}
                onPress={() => setFilters({...filters, condition: cond.id})}
              >
                <Text style={[
                  styles.optionText,
                  filters.condition === cond.id && styles.selectedOptionText
                ]}>
                  {cond.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>
            نطاق السعر: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} {ar.CURRENCIES.YER}
          </Text>
      <Slider
  style={styles.slider}
  minimumValue={0}
  maximumValue={10000000}
  step={50000}
  minimumTrackTintColor="#1E3A8A"
  maximumTrackTintColor="#E2E8F0"
  thumbTintColor="#1E3A8A"
  value={filters.priceRange[1]}
  onValueChange={(value) => setFilters({...filters, priceRange: [filters.priceRange[0], value]})}
  onSlidingComplete={(value) => setFilters({...filters, priceRange: [filters.priceRange[0], value]})}
/>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>10,000,000 {ar.CURRENCIES.YER}</Text>
          </View>
        </View>

        {/* Governorate Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>المحافظة</Text>
          <View style={styles.optionsContainer}>
            {governorates.map(gov => (
              <TouchableOpacity
                key={gov}
                style={[
                  styles.optionButton,
                  filters.governorate === gov && styles.selectedOption
                ]}
                onPress={() => setFilters({...filters, governorate: gov})}
              >
                <Text style={[
                  styles.optionText,
                  filters.governorate === gov && styles.selectedOptionText
                ]}>
                  {gov}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Listing Type Filter */}
        <View style={styles.filterSection}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>عرض المتاجر الموثقة فقط</Text>
            <Switch
              value={filters.showVerified}
              onValueChange={(value) => setFilters({...filters, showVerified: value})}
              trackColor={{ false: '#E2E8F0', true: '#1E3A8A' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>عرض قوائم المستخدمين</Text>
            <Switch
              value={filters.showUserListings}
              onValueChange={(value) => setFilters({...filters, showUserListings: value})}
              trackColor={{ false: '#E2E8F0', true: '#1E3A8A' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>{ar.COMMON.APPLY}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Tajawal-Bold',
    color: '#1E3A8A',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  filterSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#1E3A8A',
    marginBottom: 12,
    textAlign: 'right',
  },
  optionsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  optionText: {
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
  },
  selectedOptionText: {
    color: 'white',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  switchContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  applyButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
  },
};