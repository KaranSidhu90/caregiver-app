import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'

type ChipProps = {
  label?: string;
  onRemove?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => {
  return (
    <View style={ChipStyles.container}>
      <Text style={ChipStyles.label}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove}>
          <Icon
            name="times"
            size={16}
            color="#000000"
            style={ChipStyles.removeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const ChipStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#000000',
  },
  removeIcon: {
    marginLeft: 8,
    
  },
});

export default Chip;