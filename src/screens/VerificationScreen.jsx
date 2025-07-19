// src/screens/VerificationScreen.jsx
export default function VerificationScreen({ route }) {
  const { productData } = route.params;
  
  return (
    <View style={styles.container}>
      <Text>يرجى تأكيد رقم الهاتف لإتمام عملية النشر</Text>
      <OTPInput />
      <Button title="تأكيد" onPress={() => handleVerification()} />
    </View>
  );
}