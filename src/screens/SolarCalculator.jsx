import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

const defaultAppliances = [
  { name: "CALCULATOR.APPLIANCES.LIGHT", key: "lights", watt: 12 },
  { name: "CALCULATOR.APPLIANCES.FAN", key: "fans", watt: 70 },
  {
    name: "CALCULATOR.APPLIANCES.REFRIGERATOR",
    key: "refrigerator",
    watt: 200,
  },
  { name: "CALCULATOR.APPLIANCES.IRON", key: "iron", watt: 1200 },
  { name: "CALCULATOR.APPLIANCES.OTHER", key: "other", watt: 0 },
];

const SUN_HOURS = 5;
const PANEL_EFFICIENCY = 0.8;
const BATTERY_VOLTAGE = 12;
const BATTERY_DOD = 0.5;

export default function SolarCalculator() {
  const { t } = useTranslation();
  const [appliances, setAppliances] = useState(
    defaultAppliances.map((a) => ({
      ...a,
      quantity: 0,
      hours: 0,
      watt: a.watt,
    }))
  );
  const [results, setResults] = useState(null);

  // Reset calculator when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Cleanup function - runs when screen loses focus
        setResults(null);
        setAppliances(
          defaultAppliances.map((a) => ({
            ...a,
            quantity: 0,
            hours: 0,
            watt: a.watt,
          }))
        );
      };
    }, [])
  );

  const handleChange = (idx, field, value) => {
    const updated = appliances.map((a, i) =>
      i === idx ? { ...a, [field]: Number(value) || 0 } : a
    );
    setAppliances(updated);
  };

  const canCalculate = appliances.some((a) => a.quantity > 0 && a.hours > 0);

  const handleCalculate = () => {
    const totalDailyWh = appliances.reduce(
      (sum, a) => sum + a.watt * a.quantity * a.hours,
      0
    );
    const peakLoad = appliances.reduce(
      (sum, a) => sum + a.watt * a.quantity,
      0
    );
    const requiredPanelWatt = totalDailyWh / (SUN_HOURS * PANEL_EFFICIENCY);
    const panelWatt = 550;
    const numPanels = Math.ceil(requiredPanelWatt / panelWatt);
    const batteryAh = Math.ceil(totalDailyWh / (BATTERY_VOLTAGE * BATTERY_DOD));
    const inverterWatt = Math.ceil(peakLoad * 1.25);

    setResults({
      totalDailyWh: Math.round(totalDailyWh),
      peakLoad: Math.round(peakLoad),
      requiredPanelWatt: Math.ceil(requiredPanelWatt),
      numPanels,
      panelWatt,
      batteryAh,
      inverterWatt,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.paper}>
        <Text style={styles.title}>{t("CALCULATOR.TITLE")}</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>
              <Text style={styles.bold}>{t("CALCULATOR.APPLIANCE")}</Text>
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.bold}>{t("CALCULATOR.QUANTITY")}</Text>
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.bold}>{t("CALCULATOR.WATT")}</Text>
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.bold}>{t("CALCULATOR.HOURS_PER_DAY")}</Text>
            </Text>
          </View>

          {appliances.map((appliance, idx) => (
            <View key={appliance.key} style={styles.tableRow}>
              <Text style={styles.cell}>{t(appliance.name)}</Text>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={appliance.quantity.toString()}
                onChangeText={(value) => handleChange(idx, "quantity", value)}
                min={0}
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={appliance.watt.toString()}
                onChangeText={(value) => handleChange(idx, "watt", value)}
                min={0}
                editable={appliance.key === "other"}
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={appliance.hours.toString()}
                onChangeText={(value) => handleChange(idx, "hours", value)}
                min={0}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !canCalculate && styles.disabledButton]}
            onPress={handleCalculate}
            disabled={!canCalculate}
          >
            <Text style={styles.buttonText}>{t("CALCULATOR.CALCULATE")}</Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>{t("CALCULATOR.RESULTS")}</Text>
            <Text style={styles.resultText}>
              {t("CALCULATOR.TOTAL_DAILY_ENERGY")}:{" "}
              <Text style={styles.bold}>{results.totalDailyWh} Wh</Text>
            </Text>
            <Text style={styles.resultText}>
              {t("CALCULATOR.PEAK_LOAD")}:{" "}
              <Text style={styles.bold}>{results.peakLoad} W</Text>
            </Text>
            <Text style={styles.resultText}>
              {t("CALCULATOR.SOLAR_PANELS")}:{" "}
              <Text style={styles.bold}>
                {results.numPanels} x {results.panelWatt}W
              </Text>{" "}
              ({t("CALCULATOR.TOTAL")}: {results.requiredPanelWatt}W)
            </Text>
            <Text style={styles.resultText}>
              {t("CALCULATOR.BATTERY_SIZE")}:{" "}
              <Text style={styles.bold}>{results.batteryAh} Ah</Text>{" "}
              {t("CALCULATOR.BATTERY_DETAILS")}
            </Text>
            <Text style={styles.resultText}>
              {t("CALCULATOR.INVERTER_SIZE")}:{" "}
              <Text style={styles.bold}>{results.inverterWatt} W</Text>
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  paper: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    textAlign: "left",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#43A047",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#C8E6C9",
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 12,
    textAlign: "center",
  },
  resultText: {
    marginBottom: 8,
    color: "#1B5E20",
  },
  bold: {
    fontWeight: "bold",
  },
});
