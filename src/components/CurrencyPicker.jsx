// src/components/CurrencyPicker.jsx
export default function CurrencyPicker({ selected, onSelect }) {
  const currencies = [
    { code: 'YER', name: 'ريال يمني' },
    { code: 'USD', name: 'دولار أمريكي' },
    { code: 'SAR', name: 'ريال سعودي' }
  ];

  return (
    <Picker
      selectedValue={selected}
      onValueChange={onSelect}>
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