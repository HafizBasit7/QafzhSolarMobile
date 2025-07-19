import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ApplianceInput from '../components/calculator/ApplianceInput';
import CalculatorResultsScreen from './CalculatorResultsScreen';
import { navigate } from '../navigation/navigationHelper';
import ar from '../locales/ar';

export default function CalculatorScreen() {
  const [appliances, setAppliances] = useState([
    { id: 1, name: 'مكيف', wattage: '1500', hours: '8' }
  ]);
  const [showResults, setShowResults] = useState(false);

  const addAppliance = () => {
    setAppliances([
      ...appliances,
      { id: Date.now(), name: '', wattage: '', hours: '' }
    ]);
  };

  const updateAppliance = (id, field, value) => {
    setAppliances(
      appliances.map(app => 
        app.id === id ? { ...app, [field]: value } : app
      )
    );
  };

  const removeAppliance = (id) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const calculate = () => {
    // Mock calculation - would be replaced with real logic
    const results = {
      battery: '200Ah',
      panels: '4',
      inverter: '3kW',
      cost: '2,500,000 YER'
    };
    navigate('CalculatorResultsScreen', { results });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{ar.CALCULATOR.TITLE}</Text>
      
      <Text style={styles.sectionTitle}>{ar.CALCULATOR.APPLIANCE}</Text>
      
      {appliances.map((appliance) => (
        <ApplianceInput
          key={appliance.id}
          appliance={appliance}
          onUpdate={updateAppliance}
          onRemove={removeAppliance}
        />
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={addAppliance}
      >
        <Text style={styles.addButtonText}>
          + {ar.CALCULATOR.ADD_APPLIANCE}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.calculateButton}
        onPress={calculate}
      >
        <Text style={styles.calculateButtonText}>
          {ar.CALCULATOR.CALCULATE}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#1E3A8A',
    fontFamily: 'Tajawal-Regular',
  },
  calculateButton: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
  },
};