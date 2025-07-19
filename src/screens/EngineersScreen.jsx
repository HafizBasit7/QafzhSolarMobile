import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import EngineerCard from '../components/EngineerCard';
import EngineerFilter from '../components/EngineerFilter';
import { navigate } from '../navigation/navigationHelper';
import ar from '../locales/ar';

// Mock data - to be replaced with real API calls later
const mockEngineers = [
  {
    id: '1',
    name: 'أحمد محمد',
    services: ['تركيب', 'صيانة'],
    phone: '+967712345678',
    governorate: 'صنعاء'
  },
  {
    id: '2',
    name: 'علي عبدالله',
    services: ['تصميم', 'استشارات'],
    phone: '+967712345679',
    governorate: 'عدن'
  },
  // Add more mock engineers as needed
];

export default function EngineersScreen() {
  const [filteredEngineers, setFilteredEngineers] = useState(mockEngineers);
  const [selectedGov, setSelectedGov] = useState('');

  const handleFilter = (governorate) => {
    setSelectedGov(governorate);
    if (!governorate) {
      setFilteredEngineers(mockEngineers);
    } else {
      setFilteredEngineers(
        mockEngineers.filter(eng => eng.governorate === governorate)
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ar.ENGINEERS.TITLE}</Text>
      
      <EngineerFilter 
        governorates={[...new Set(mockEngineers.map(eng => eng.governorate))]}
        selectedGov={selectedGov}
        onFilter={handleFilter}
      />

      <FlatList
        data={filteredEngineers}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigate('EngineerDetail', { engineer: item })}
          >
            <EngineerCard engineer={item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا يوجد مهندسون متاحون</Text>
        }
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 16,
    color: '#1E3A8A',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#64748B',
  },
};