import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function CalculatorResultsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { results } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("CALCULATOR.RESULTS")}</Text>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{t("CALCULATOR.BATTERY")}</Text>
        <Text style={styles.resultValue}>{results.battery}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{t("CALCULATOR.PANELS")}</Text>
        <Text style={styles.resultValue}>{results.panels}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{t("CALCULATOR.INVERTER")}</Text>
        <Text style={styles.resultValue}>{results.inverter}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{t("CALCULATOR.ESTIMATED_COST")}</Text>
        <Text style={styles.resultValue}>{results.cost}</Text>
      </View>

      {/* Ad Banner Placeholder */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>{t("CALCULATOR.AD_SPACE")}</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>
          {t("CALCULATOR.BACK_TO_CALCULATOR")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontFamily: "Tajawal-Bold",
    textAlign: "right",
    color: "#1E3A8A",
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 16,
    fontFamily: "Tajawal-Regular",
    color: "#64748B",
    textAlign: "right",
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 20,
    fontFamily: "Tajawal-Bold",
    color: "#1E3A8A",
    textAlign: "right",
  },
  adBanner: {
    height: 100,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  adText: {
    color: "#1E3A8A",
    fontFamily: "Tajawal-Regular",
  },
  backButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },
};
