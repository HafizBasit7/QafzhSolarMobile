import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ar from '../../locales/ar';

export default function ApplianceInput({ appliance, onUpdate, onRemove }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.applianceNumber}>جهاز #{appliance.id}</Text>
        {appliance.id !== 1 && (
          <TouchableOpacity onPress={() => onRemove(appliance.id)}>
            <Text style={styles.removeText}>إزالة</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{ar.CALCULATOR.APPLIANCE}</Text>
        <TextInput
          style={styles.input}
          value={appliance.name}
          onChangeText={(text) => onUpdate(appliance.id, 'name', text)}
          placeholder="مثال: مكيف"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{ar.CALCULATOR.WATTAGE}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={appliance.wattage}
          onChangeText={(text) => onUpdate(appliance.id, 'wattage', text)}
          placeholder="بالواط"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{ar.CALCULATOR.HOURS}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={appliance.hours}
          onChangeText={(text) => onUpdate(appliance.id, 'hours', text)}
          placeholder="ساعات الاستخدام اليومي"
          textAlign="right"
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  applianceNumber: {
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
  },
  removeText: {
    color: '#EF4444',
    fontFamily: 'Tajawal-Regular',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Tajawal-Regular',
    marginBottom: 6,
    textAlign: 'right',
    color: '#1E3A8A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 10,
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    backgroundColor: '#F8FAFC',
  },
};