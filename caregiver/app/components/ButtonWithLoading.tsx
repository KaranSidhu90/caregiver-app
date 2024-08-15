import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";


type ButtonWithLoadingProps = TouchableOpacityProps & {
  loading?: boolean;
  style?: any;
  textStyle?: any;
};

const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({ loading, children, style, textStyle, ...props }) => {
  const buttonStyle = [styles.button, style];
  const textStyles = [styles.buttonText, textStyle];

  return (
    <TouchableOpacity style={buttonStyle} {...props}>
      {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#FFF" />}
      <Text style={[textStyles, loading && { color: 'transparent' }]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#295259',
    borderRadius: 35,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  loadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ButtonWithLoading;