import React from 'react';
import { Picker } from '@react-native-picker/picker'; // Correct import

export default function CurrencyPicker({ selected, onSelect }) {
  const currencies = [
    { code: 'YER', name: 'ريال يمني' },
    { code: 'USD', name: 'دولار أمريكي' },
    { code: 'SAR', name: 'ريال سعودي' }
  ];

  return (
    <Picker
      selectedValue={selected}
      onValueChange={onSelect}
      style={styles.picker} // Add style if needed
      dropdownIconColor="#16A34A" // Optional: style the dropdown icon
    >
      {currencies.map(currency => (
        <Picker.Item 
          key={currency.code} 
          label={currency.name} 
          value={currency.code} 
        />
      ))}
    </Picker>
  );
}

// Add styles if needed
const styles = {
  picker: {
    width: 120, // Adjust width as needed
    height: 50, // Adjust height as needed
  }
};