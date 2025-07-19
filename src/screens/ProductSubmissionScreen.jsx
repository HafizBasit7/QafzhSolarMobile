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
import ar from "../locales/ar";

// Sample data
const brands = [
  { label: "Jinko Solar", value: "jinko" },
  { label: "Longi", value: "longi" },
  { label: "Huawei", value: "huawei" },
  { label: "Tesla", value: "tesla" }
];

const productTypes = [
  { label: ar.PRODUCT_TYPES?.PANEL || "ألواح شمسية", value: "panel" },
  { label: ar.PRODUCT_TYPES?.INVERTER || "انفرتر", value: "inverter" },
  { label: ar.PRODUCT_TYPES?.BATTERY || "بطارية", value: "battery" },
  { label: ar.PRODUCT_TYPES?.ACCESSORY || "ملحقات", value: "accessory" },
];

const governorates = [
  { label: "صنعاء", value: "sanaa", cities: ["القديمة", "الجديدة"] },
  { label: "عدن", value: "aden", cities: ["كريتر", "خور مكسر"] }
];

export default function ProductSubmissionScreen({ route }) {
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
    phone: route.params?.prefillPhone || "",
    images: [],
  });

  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!product.type) return "نوع المنتج مطلوب";
    if (!product.title) return "عنوان المنتج مطلوب";
    if (!product.price) return "السعر مطلوب";
    if (!product.brand) return "العلامة التجارية مطلوبة";
    if (!product.governorate) return "المحافظة مطلوبة";
    // if (!product.city) return "المدينة مطلوبة";
    // if (product.images.length === 0) return "صورة المنتج مطلوبة";
    return null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const error = validateForm();
    if (error) {
      Alert.alert("خطأ", error);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!product.phone) {
        navigate("Verification", { 
          productData: product,
          onSuccess: () => submitProduct()
        });
      } else {
        await submitProduct();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitProduct = async () => {
    try {
      const submissionData = {
        ...product,
        status: "pending",
        submittedAt: new Date().toISOString()
      };

      console.log("Submitting:", submissionData);
      
      Alert.alert(
        "تم الإرسال",
        "تم إرسال المنتج بنجاح وسيظهر بعد الموافقة عليه",
        [{ text: "حسناً", onPress: () => navigate("Marketplace") }]
      );
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء إرسال المنتج");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>
        {ar.PRODUCT_FORM?.TITLE || "إضافة منتج جديد"}
      </Text>

      {/* Product Type */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.PRODUCT_TYPE || "نوع المنتج"}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.type}
            onValueChange={(value) => setProduct({ ...product, type: value })}
            dropdownIconColor="#1E40AF"
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item 
              label={ar.PRODUCT_FORM?.SELECT_TYPE || "اختر نوع المنتج"} 
              value="" 
            />
            {productTypes.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Condition */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.CONDITION || "حالة المنتج"}
        </Text>
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
                {cond === "new"
                  ? "جديد"
                  : cond === "used"
                  ? "مستعمل"
                  : "يحتاج إصلاح"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.TITLE || "عنوان المنتج"}
        </Text>
        <TextInput
          style={styles.input}
          value={product.title}
          onChangeText={(text) => setProduct({ ...product, title: text })}
          placeholder={ar.PRODUCT_FORM?.TITLE_PLACEHOLDER || "أدخل عنوان المنتج"}
        />
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.DESCRIPTION || "وصف المنتج"}
        </Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline
          value={product.description}
          onChangeText={(text) => setProduct({ ...product, description: text })}
          placeholder={ar.PRODUCT_FORM?.DESCRIPTION_PLACEHOLDER || "أدخل وصف المنتج"}
        />
      </View>

      {/* Price */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.PRICE || "السعر"}
        </Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={product.price}
            onChangeText={(text) => setProduct({ ...product, price: text })}
            placeholder={ar.PRODUCT_FORM?.PRICE_PLACEHOLDER || "أدخل السعر"}
          />
          <CurrencyPicker
            selected={product.currency}
            onSelect={(currency) => setProduct({ ...product, currency })}
          />
        </View>
      </View>

      {/* Brand */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.BRAND || "العلامة التجارية"}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.brand}
            onValueChange={(value) => setProduct({ ...product, brand: value })}
          >
            <Picker.Item label="اختر العلامة التجارية" value="" />
            {brands.map((brand) => (
              <Picker.Item key={brand.value} label={brand.label} value={brand.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Governorate */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {ar.PRODUCT_FORM?.GOVERNORATE || "المحافظة"}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.governorate}
            onValueChange={handleGovernorateChange}
          >
            <Picker.Item label="اختر المحافظة" value="" />
            {governorates.map((gov) => (
              <Picker.Item key={gov.value} label={gov.label} value={gov.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* City */}
      {/* {product.governorate && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {ar.PRODUCT_FORM?.CITY || "المدينة"}
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.city}
              onValueChange={(value) => setProduct({ ...product, city: value })}
            >
              <Picker.Item label="اختر المدينة" value="" />
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>
      )} */}

      {/* Image Uploader */}
      {/* <ImageUploader
        images={product.images}
        onImagesChange={(images) => setProduct({ ...product, images })}
      /> */}

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting 
            ? "جاري الإرسال..." 
            : product.phone 
              ? ar.COMMON?.SUBMIT || "إرسال" 
              : ar.COMMON?.VERIFY_AND_SUBMIT || "التحقق ثم الإرسال"}
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
    backgroundColor: "#1E40AF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#93C5FD",
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