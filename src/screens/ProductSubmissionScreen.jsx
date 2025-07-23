import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ImageUploader from "../utils/imageUpload";
import CurrencyPicker from "../components/CurrencyPicker";
import { navigate } from "../navigation/navigationHelper";
import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
// import AuthGuard from "../components/common/AuthGuard";
import { showToast } from "../components/common/Toast";

export default function ProductSubmissionScreen({ route }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createProduct, isCreating } = useProducts();

  const brands = [
    { label: t('BRANDS.JINKO'), value: 'jinko' },
    { label: t('BRANDS.LONGI'), value: 'longi' },
    { label: t('BRANDS.HUAWEI'), value: 'huawei' },
    { label: t('BRANDS.TESLA'), value: 'tesla' }
  ];

  const [product, setProduct] = useState({
    type: "",
    condition: "new",
    title: "",
    description: "",
    price: "",
    currency: "YER",
    brand: "",
    governorate: "",
    city: "",
    phone: user?.phone || "",
    images: [],
  });

  const governorates = [
    { label: t("GOVERNORATES.SANAA"), value: "sanaa", cities: [t("CITIES.OLD"), t("CITIES.NEW")] },
    { label: t("GOVERNORATES.ADEN"), value: "aden", cities: [t("CITIES.CRATER"), t("CITIES.KHORMAKSAR")] }
  ];

  const productTypes = [
    { label: t("PRODUCT_TYPES.PANEL"), value: "panel" },
    { label: t("PRODUCT_TYPES.INVERTER"), value: "inverter" },
    { label: t("PRODUCT_TYPES.BATTERY"), value: "battery" },
    { label: t("PRODUCT_TYPES.ACCESSORY"), value: "accessory" },
  ];

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

  const validateForm = () => {
    if (!product.type) return t("VALIDATION.PRODUCT_TYPE_REQUIRED");
    if (!product.title) return t("VALIDATION.TITLE_REQUIRED");
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
        phone: user.phone,
      });

      showToast('success', 'Success', t('PRODUCT_FORM.SUCCESS_MESSAGE'));
      navigate('Marketplace');
    } catch (error) {
      showToast('error', 'Error', error.message || t('PRODUCT_FORM.SUBMIT_ERROR'));
    }
  };

  return (
    // <AuthGuard>
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
          <View style={styles.conditionOptions}>
            {["new", "used", "needs_repair"].map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.conditionOption,
                  product.condition === cond && styles.selectedCondition,
                ]}
                onPress={() => setProduct({ ...product, condition: cond })}
              >
                <Text style={styles.conditionText}>
                  {t(`CONDITIONS.${cond.toUpperCase()}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("PRODUCT_FORM.TITLE")}</Text>
          <TextInput
            style={styles.input}
            value={product.title}
            onChangeText={(text) => setProduct({ ...product, title: text })}
            placeholder={t("PRODUCT_FORM.TITLE_PLACEHOLDER")}
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

        {/* Brand */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("PRODUCT_FORM.BRAND")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.brand}
              onValueChange={(value) => setProduct({ ...product, brand: value })}
            >
              <Picker.Item label={t("PRODUCT_FORM.BRAND")} value="" />
              {brands.map((brand) => (
                <Picker.Item key={brand.value} label={brand.label} value={brand.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Governorate */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("PRODUCT_FORM.GOVERNORATE")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.governorate}
              onValueChange={handleGovernorateChange}
            >
              <Picker.Item label={t("PRODUCT_FORM.GOVERNORATE")} value="" />
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
    // </AuthGuard>
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
  conditionOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 8,
  },
  conditionOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedCondition: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  conditionText: {
    fontFamily: "Tajawal-Medium",
    color: "#1E293B",
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
});