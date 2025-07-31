import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 300,
    height: 300,
  },
});