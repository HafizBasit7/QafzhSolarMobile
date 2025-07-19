import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ar from '../locales/ar';

export default function AdBannerScreen() {
  const route = useRoute();
  const { ad } = route.params;

  const handlePress = () => {
    if (ad.link.startsWith('http')) {
      Linking.openURL(ad.link);
    } else {
      // Handle internal navigation
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: ad.image }} style={styles.adImage} resizeMode="contain" />
      
      <View style={styles.content}>
        <Text style={styles.adTitle}>{ad.title}</Text>
        {ad.description && (
          <Text style={styles.adDescription}>{ad.description}</Text>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
          <Text style={styles.actionText}>{ad.cta || 'عرض التفاصيل'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  adImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
    alignItems: 'flex-end',
  },
  adTitle: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#1E3A8A',
    marginBottom: 10,
    textAlign: 'right',
  },
  adDescription: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'right',
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  actionText: {
    color: 'white',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
  },
};