import { Formik } from "formik";
import { TextInput, Button, Text, Avatar } from "react-native-paper";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { LoginValidation } from "@/validations/validation";
import { useLoginMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";

const LoginScreen = () => {
  const { navigate, goBack } = myNavigation();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();
      navigate("หน้าหลัก");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginValidation}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <Avatar.Image
              source={require("../../../assets/icon.png")}
              size={200}
              style={styles.profileImage}
            />

            <Text style={styles.titleText}>เข้าสู่ระบบ</Text>

            <TextInput
              label="อีเมล"
              mode="outlined"
              style={styles.input}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              label="รหัสผ่าน"
              mode="outlined"
              secureTextEntry
              style={styles.input}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password && !!errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.confirmButton}
              labelStyle={styles.buttonText}
              loading={isLoading}
            >
              ยืนยัน
            </Button>

            <Button
              mode="outlined"
              onPress={() => goBack()}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              ยกเลิก
            </Button>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.backgroundMain,
  },
  formContainer: {
    alignItems: "center",
  },
  profileImage: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: colors.accentGreen,
    borderRadius: 10,
  },
  cancelButton: {
    marginTop: 10,
    width: "100%",
    borderColor: colors.accentGreen,
    borderWidth: 2,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accentGreen,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
});
