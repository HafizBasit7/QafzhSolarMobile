// // navigation/index.js
// import { createStackNavigator } from '@react-navigation/stack';
// import MarketplaceScreen from '../screens/MarketplaceScreen';
// import ProductDetailScreen from '../screens/ProductDetailScreen';
// import ShopScreen from '../screens/ShopScreen';

// const Stack = createStackNavigator();

// export default function MarketplaceStack() {
//   return (
//     <Stack.Navigator initialRouteName="Marketplace">
//       <Stack.Screen 
//         name="Marketplace" 
//         component={MarketplaceScreen} 
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen 
//         name="ProductDetail" 
//         component={ProductDetailScreen} 
//         options={{ title: 'تفاصيل المنتج' }}
//       />
//       <Stack.Screen 
//         name="ShopDetail" 
//         component={ShopScreen} 
//         options={{ title: 'تفاصيل المتجر' }}
//       />
//     </Stack.Navigator>
//   );
// }