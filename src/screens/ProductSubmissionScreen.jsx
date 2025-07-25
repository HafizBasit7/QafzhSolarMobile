import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ImageUploader from "../utils/imageUpload";
import CurrencyPicker from "../components/CurrencyPicker";
import { navigate } from "../navigation/navigationHelper";
import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../components/common/Toast";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ProductSubmissionScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { user, isLoadingUser } = useAuth();
  const { createProduct, isCreating } = useProducts();

  // If loading user state, show spinner
  if (isLoadingUser) {
    return <LoadingSpinner />;
  }

  // User should be verified at this point due to AuthGuard
  const [product, setProduct] = useState({
    name: "",
    description: "",
    type: "",
    condition: "New",
    brand: "",
    model: "",
    price: "",
    currency: "USD",
    phone: user?.phone || "", // Pre-fill user's phone
    whatsappPhone: "",
    governorate: "",
    city: "",
    locationText: "",
    images: [],
    specifications: {
      power: "",
      voltage: "",
      capacity: "",
      warranty: ""
    },
    isNegotiable: true,
    isActive: true,
    featured: false
  });
  
  const brands = [
    { label: t('BRANDS.JINKO'), value: 'Jinko' },
    { label: t('BRANDS.LONGI'), value: 'Longi' },
    { label: t('BRANDS.HUAWEI'), value: 'Huawei' },
    { label: t('BRANDS.TESLA'), value: 'Tesla' }
  ];

  const governorates = [
    { label: t("GOVERNORATES.SANAA"), value: "Sana'a", cities: ["Al Wahdah", "Azal"] },
    { label: t("GOVERNORATES.ADEN"), value: "Aden", cities: ["Crater", "Khormaksar"] }
  ];

  const productTypes = [
    { label: t("PRODUCT_TYPES.PANEL"), value: "Panel" },
    { label: t("PRODUCT_TYPES.INVERTER"), value: "Inverter" },
    { label: t("PRODUCT_TYPES.BATTERY"), value: "Battery" },
    { label: t("PRODUCT_TYPES.ACCESSORY"), value: "Accessory" },
  ];

  const conditions = ["New", "Used", "Refurbished"];

  const [cities, setCities] = useState([]);

  const handleGovernorateChange = (value) => {
    const selectedGov = governorates.find(g => g.value === value);
    setCities(selectedGov?.cities || []);
    setProduct({
      ...product,
      governorate: value,
      city: ""
    });
  };

  const handleSpecificationChange = (key, value) => {
    setProduct({
      ...product,
      specifications: {
        ...product.specifications,
        [key]: value
      }
    });
  };

  const validateForm = () => {
    if (!product.type) return t("VALIDATION.PRODUCT_TYPE_REQUIRED");
    if (!product.name) return t("VALIDATION.NAME_REQUIRED");
    if (!product.price) return t("VALIDATION.PRICE_REQUIRED");
    if (!product.brand) return t("VALIDATION.BRAND_REQUIRED");
    if (!product.governorate) return t("VALIDATION.GOVERNORATE_REQUIRED");
    return null;
  };

  const handleSubmit = async () => {
    if (isCreating) return;

    const error = validateForm();
    if (error) {
      showToast('error', 'Error', error);
      return;
    }

    try {
      await createProduct({
        ...product,
        price: parseFloat(product.price),
        phone: user.phone, // Always use verified phone
      });

      showToast('success', 'Success', t('PRODUCT_FORM.SUCCESS_MESSAGE'));
      navigation.navigate('MarketplaceTab');
    } catch (error) {
      showToast('error', 'Error', error.message || t('PRODUCT_FORM.SUBMIT_ERROR'));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{t("PRODUCT_FORM.TITLE")}</Text>

      {/* Product Type */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.PRODUCT_TYPE")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.type}
            onValueChange={(value) => setProduct({ ...product, type: value })}
            dropdownIconColor="#16A34A"
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label={t("PRODUCT_FORM.SELECT_TYPE")} value="" />
            {productTypes.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Condition */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.CONDITION")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.condition}
            onValueChange={(value) => setProduct({ ...product, condition: value })}
          >
            {conditions.map((cond) => (
              <Picker.Item key={cond} label={cond} value={cond} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.NAME")}</Text>
        <TextInput
          style={styles.input}
          value={product.name}
          onChangeText={(text) => setProduct({ ...product, name: text })}
          placeholder={t("PRODUCT_FORM.NAME_PLACEHOLDER")}
        />
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.DESCRIPTION")}</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline
          value={product.description}
          onChangeText={(text) => setProduct({ ...product, description: text })}
          placeholder={t("PRODUCT_FORM.DESCRIPTION_PLACEHOLDER")}
        />
      </View>

      {/* Brand */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.BRAND")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.brand}
            onValueChange={(value) => setProduct({ ...product, brand: value })}
          >
            <Picker.Item label={t("PRODUCT_FORM.SELECT_BRAND")} value="" />
            {brands.map((brand) => (
              <Picker.Item key={brand.value} label={brand.label} value={brand.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Model */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.MODEL")}</Text>
        <TextInput
          style={styles.input}
          value={product.model}
          onChangeText={(text) => setProduct({ ...product, model: text })}
          placeholder={t("PRODUCT_FORM.MODEL_PLACEHOLDER")}
        />
      </View>

      {/* Price */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.PRICE")}</Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={product.price}
            onChangeText={(text) => setProduct({ ...product, price: text })}
            placeholder={t("PRODUCT_FORM.PRICE_PLACEHOLDER")}
          />
          <CurrencyPicker
            selected={product.currency}
            onSelect={(currency) => setProduct({ ...product, currency })}
          />
        </View>
      </View>

      {/* Phone */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.PHONE")}</Text>
        <TextInput
          style={styles.input}
          value={product.phone}
          onChangeText={(text) => setProduct({ ...product, phone: text })}
          placeholder={t("PRODUCT_FORM.PHONE_PLACEHOLDER")}
          keyboardType="phone-pad"
        />
      </View>

      {/* WhatsApp Phone */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.WHATSAPP_PHONE")}</Text>
        <TextInput
          style={styles.input}
          value={product.whatsappPhone}
          onChangeText={(text) => setProduct({ ...product, whatsappPhone: text })}
          placeholder={t("PRODUCT_FORM.WHATSAPP_PHONE_PLACEHOLDER")}
          keyboardType="phone-pad"
        />
      </View>

      {/* Governorate */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.GOVERNORATE")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.governorate}
            onValueChange={handleGovernorateChange}
          >
            <Picker.Item label={t("PRODUCT_FORM.SELECT_GOVERNORATE")} value="" />
            {governorates.map((gov) => (
              <Picker.Item key={gov.value} label={gov.label} value={gov.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* City */}
      {product.governorate && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("PRODUCT_FORM.CITY")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.city}
              onValueChange={(value) => setProduct({ ...product, city: value })}
            >
              <Picker.Item label={t("PRODUCT_FORM.SELECT_CITY")} value="" />
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Location Text */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.LOCATION_TEXT")}</Text>
        <TextInput
          style={styles.input}
          value={product.locationText}
          onChangeText={(text) => setProduct({ ...product, locationText: text })}
          placeholder={t("PRODUCT_FORM.LOCATION_TEXT_PLACEHOLDER")}
        />
      </View>

      {/* Specifications */}
      <Text style={[styles.label, { marginTop: 20 }]}>{t("PRODUCT_FORM.SPECIFICATIONS")}</Text>
      
      {/* Power */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.POWER")}</Text>
        <TextInput
          style={styles.input}
          value={product.specifications.power}
          onChangeText={(text) => handleSpecificationChange("power", text)}
          placeholder={t("PRODUCT_FORM.POWER_PLACEHOLDER")}
        />
      </View>

      {/* Voltage */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.VOLTAGE")}</Text>
        <TextInput
          style={styles.input}
          value={product.specifications.voltage}
          onChangeText={(text) => handleSpecificationChange("voltage", text)}
          placeholder={t("PRODUCT_FORM.VOLTAGE_PLACEHOLDER")}
        />
      </View>

      {/* Capacity */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.CAPACITY")}</Text>
        <TextInput
          style={styles.input}
          value={product.specifications.capacity}
          onChangeText={(text) => handleSpecificationChange("capacity", text)}
          placeholder={t("PRODUCT_FORM.CAPACITY_PLACEHOLDER")}
        />
      </View>

      {/* Warranty */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("PRODUCT_FORM.WARRANTY")}</Text>
        <TextInput
          style={styles.input}
          value={product.specifications.warranty}
          onChangeText={(text) => handleSpecificationChange("warranty", text)}
          placeholder={t("PRODUCT_FORM.WARRANTY_PLACEHOLDER")}
        />
      </View>

      {/* Toggle Switches */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{t("PRODUCT_FORM.NEGOTIABLE")}</Text>
          <Switch
            value={product.isNegotiable}
            onValueChange={(value) => setProduct({ ...product, isNegotiable: value })}
            trackColor={{ false: "#767577", true: "#16A34A" }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{t("PRODUCT_FORM.ACTIVE")}</Text>
          <Switch
            value={product.isActive}
            onValueChange={(value) => setProduct({ ...product, isActive: value })}
            trackColor={{ false: "#767577", true: "#16A34A" }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{t("PRODUCT_FORM.FEATURED")}</Text>
          <Switch
            value={product.featured}
            onValueChange={(value) => setProduct({ ...product, featured: value })}
            trackColor={{ false: "#767577", true: "#16A34A" }}
          />
        </View>
      </View>

      {/* Image Uploader */}
      <ImageUploader
        images={product.images}
        onImagesChange={(images) => setProduct({ ...product, images })}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isCreating && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isCreating}
      >
        <Text style={styles.submitButtonText}>
          {isCreating ? t("COMMON.SUBMITTING") : t("COMMON.SUBMIT")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  content: {
    paddingBottom: 100,
  },
  formGroup: {
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 8,
  },
  picker: {
    width: '100%',
    color: '#1E293B',
  },
  label: {
    fontFamily: "Tajawal-Medium",
    color: "#475569",
    fontSize: 16,
    textAlign: "right",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Tajawal-Regular",
    textAlign: "right",
    marginTop: 8,
  },
  priceInputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Tajawal-Regular",
    textAlign: "right",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontFamily: "Tajawal-Bold",
    fontSize: 20,
    color: "#1E293B",
    textAlign: "right",
    marginBottom: 24,
  },
  toggleContainer: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabel: {
    fontFamily: "Tajawal-Medium",
    color: "#475569",
    fontSize: 16,
  }
});