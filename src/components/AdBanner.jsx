// src/components/AdBanner.jsx
export default function AdBanner({ ad }) {
  return (
    <TouchableOpacity style={styles.banner}>
      <Image source={{ uri: ad.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );
}