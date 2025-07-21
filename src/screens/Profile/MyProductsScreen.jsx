// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';

// const MyProductsScreen = () => {
//   const myProducts = [
//     { id: '1', title: 'بطارية 200 أمبير', price: '300,000 ريال', status: 'معروض' },
//     { id: '2', title: 'انفرتر 5000 وات', price: '450,000 ريال', status: 'مباع' },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>منتجاتي</Text>
      
//       <FlatList
//         data={myProducts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.productItem}>
//             <Text style={styles.productTitle}>{item.title}</Text>
//             <Text style={styles.productPrice}>{item.price}</Text>
//             <Text style={[
//               styles.productStatus,
//               item.status === 'مباع' && styles.soldStatus
//             ]}>
//               {item.status}
//             </Text>
//           </View>
//         )}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F8FAFC',
//   },
//   title: {
//     fontFamily: 'Tajawal-Bold',
//     fontSize: 24,
//     textAlign: 'right',
//     marginBottom: 20,
//     color: '#1E293B',
//   },
//   productItem: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   productTitle: {
//     fontFamily: 'Tajawal-Medium',
//     fontSize: 16,
//     textAlign: 'right',
//     color: '#1E293B',
//   },
//   productPrice: {
//     fontFamily: 'Tajawal-Regular',
//     fontSize: 14,
//     textAlign: 'right',
//     color: '#64748B',
//     marginTop: 4,
//   },
//   productStatus: {
//     fontFamily: 'Tajawal-Regular',
//     fontSize: 14,
//     textAlign: 'right',
//     color: '#16A34A',
//     marginTop: 4,
//   },
//   soldStatus: {
//     color: '#EF4444',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// export default MyProductsScreen;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyProductsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>منتجاتي</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
  },
});

export default MyProductsScreen;
