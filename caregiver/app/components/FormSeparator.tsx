import { StyleSheet, Text, View } from "react-native";

type FormSeparatorProps = {
  title?: string;
};

const FormSeparatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
});

const FormSeparator: React.FC<FormSeparatorProps> = ({ title }) => {
  return (
    <View style={FormSeparatorStyles.container}>
      {!!title && <Text style={FormSeparatorStyles.title}>{title}</Text>}
      <View style={FormSeparatorStyles.line} />
    </View>
  );
}

export default FormSeparator;