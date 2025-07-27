import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

const ProductCard = ({ product, onLike, onUnlike }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-YE", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleLikePress = () => {
    if (product.isLiked) {
      onUnlike();
    } else {
      onLike();
    }
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="broken-image" size={32} color="#CBD5E1" />
          <Text style={styles.placeholderText}>لا توجد صورة</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.images?.[0] || "https://via.placeholder.com/300",
          }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator color="#16A34A" size="large" />
          </View>
        )}

        {/* Like Button */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLikePress}
          disabled={!user}
        >
          <Ionicons
            name={product.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={product.isLiked ? "#EF4444" : "#FFFFFF"}
          />
        </TouchableOpacity>

        {/* Condition Badge */}
        <View
          style={[styles.conditionBadge, styles[`${product.condition}Badge`]]}
        >
          <Text
            style={[styles.conditionText, styles[`${product.condition}Text`]]}
          >
            {t(`CONDITIONS.${product.condition.toUpperCase()}`)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImage()}

      <View style={styles.content}>
        {/* Title - Single line with ellipsis */}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.currency}>{product.currency}</Text>
          </View>
          {product.isNegotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableText}>قابل للتفاوض</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={14} color="#64748B" />
          <Text style={styles.location} numberOfLines={1}>
            {product.city}, {product.governorate}
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Verified Badge */}
          {product.isVerified && (
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={14} color="#10B981" />
              <Text style={styles.verifiedText}>موثوق</Text>
            </View>
          )}

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Product Type */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {product.type === "Panel"
                ? "ألواح"
                : product.type === "Inverter"
                ? "محول"
                : product.type === "Battery"
                ? "بطارية"
                : "منتج"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    backgroundColor: "#F8FAFC",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
    fontFamily: "Tajawal-Regular",
  },
  likeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  conditionBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newBadge: {
    backgroundColor: "#DCFCE7",
  },
  usedBadge: {
    backgroundColor: "#DBEAFE",
  },
  needs_repairBadge: {
    backgroundColor: "#FEE2E2",
  },
  conditionText: {
    fontSize: 11,
    fontFamily: "Tajawal-Bold",
  },
  newText: {
    color: "#166534",
  },
  usedText: {
    color: "#1E40AF",
  },
  needs_repairText: {
    color: "#DC2626",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: "Tajawal-Bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "right",
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontFamily: "Tajawal-Bold",
    color: "#16A34A",
  },
  currency: {
    fontSize: 14,
    fontFamily: "Tajawal-Medium",
    color: "#16A34A",
  },
  negotiableBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  negotiableText: {
    fontSize: 11,
    fontFamily: "Tajawal-Medium",
    color: "#D97706",
  },
  locationContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    fontFamily: "Tajawal-Regular",
    color: "#64748B",
    flex: 1,
    textAlign: "right",
  },
  bottomSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verifiedBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: "Tajawal-Medium",
    color: "#10B981",
  },
  spacer: {
    flex: 1,
  },
  typeBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontFamily: "Tajawal-Medium",
    color: "#475569",
  },
});

export default ProductCard;
