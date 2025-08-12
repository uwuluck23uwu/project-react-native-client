import { Formik } from "formik";
import { TextInput, Button, Text, Avatar } from "react-native-paper";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { RegisterValidation } from "@/validations/validation";
import { useRegisterMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";

const RegisterScreen = () => {
  const { navigate, goBack } = myNavigation();
  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      const { confirmPassword, ...payload } = values;
      await register(payload).unwrap();
      navigate("เข้าสู่ระบบ");
    } catch (err) {
      console.error("สมัครไม่สำเร็จ:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterValidation}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleRegister}
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
              source={require("@/../assets/icon.png")}
              size={200}
              style={styles.profileImage}
            />

            <Text style={styles.titleText}>สมัครสมาชิก</Text>

            <TextInput
              label="ชื่อผู้ใช้"
              mode="outlined"
              style={styles.input}
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={touched.name && !!errors.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

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

            <TextInput
              label="ยืนยันรหัสผ่าน"
              mode="outlined"
              secureTextEntry
              style={styles.input}
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={touched.confirmPassword && !!errors.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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

export default RegisterScreen;

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
