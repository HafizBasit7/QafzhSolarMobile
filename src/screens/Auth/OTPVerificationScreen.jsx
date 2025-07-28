import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../components/common/CustomModal";

const OTPVerificationScreen = ({ navigation, route }) => {
  const { verifyOTP, isVerifyingOTP, requestOTP, isRequestingOTP, currentUser } = useAuth();
  const { modalState, hideModal, showSuccess, showError } = useModal();
  const { phone, returnData, isNewUser } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Use phone from route params or current user
  const phoneNumber = phone || currentUser?.phone;

  // Auto verify when default OTP (112233) is entered
  useEffect(() => {
    const enteredOTP = otp.join("");
    if (enteredOTP === "112233") {
      handleVerify("112233");
    }
  }, [otp]);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (enteredOTP = null) => {
    const otpToVerify = enteredOTP || otp.join("");

    if (otpToVerify.length !== 6) {
      showError("خطأ", "يرجى إدخال رمز التحقق كاملاً");
      return;
    }

    try {
      await verifyOTP({ phone: phoneNumber, otp: otpToVerify });
      
      // Success message is handled by the mutation
      // Navigate back to main app
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainStack" }],
        });
      }, 1500); // Give time to see success message
      
    } catch (error) {
      // Error is handled by the mutation
      console.error('OTP verification error:', error);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      await requestOTP(phoneNumber);
      setTimer(60);
      // Success message is handled by the mutation
    } catch (error) {
      // Error is handled by the mutation
      console.error('Resend OTP error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>تأكيد رقم الهاتف</Text>
        <Text style={styles.subtitle}>تم إرسال رمز التحقق إلى {phoneNumber}</Text>
        <Text style={styles.devNote}>
          ملاحظة للمطور: أدخل "112233" للتحقق التلقائي
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifyingOTP}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isVerifyingOTP && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isVerifyingOTP}
        >
          {isVerifyingOTP ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>تأكيد</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            (timer > 0 || isRequestingOTP) && styles.resendButtonDisabled,
          ]}
          onPress={handleResendOTP}
          disabled={timer > 0 || isRequestingOTP}
        >
          {isRequestingOTP ? (
            <ActivityIndicator size="small" color="#16A34A" />
          ) : (
            <Text
              style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}
            >
              {timer > 0
                ? `إعادة الإرسال خلال ${timer} ثانية`
                : "إعادة إرسال الرمز"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={modalState.visible}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={hideModal}
        actionText={modalState.actionText}
        onAction={modalState.onAction}
        autoClose={modalState.autoClose}
        duration={modalState.duration}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#475569",
  },
  title: {
    fontSize: 28,
    fontFamily: "Tajawal-Bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Tajawal-Regular",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
  },
  devNote: {
    fontSize: 14,
    fontFamily: "Tajawal-Regular",
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    fontSize: 24,
    fontFamily: "Tajawal-Bold",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
  },
  button: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Tajawal-Bold",
  },
  resendButton: {
    alignItems: "center",
    padding: 12,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: "#16A34A",
    fontSize: 14,
    fontFamily: "Tajawal-Medium",
  },
  resendTextDisabled: {
    color: "#94A3B8",
  },
});

export default OTPVerificationScreen;
