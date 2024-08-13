import { StyleSheet, TextInput, View } from "react-native";
import Chip from "./Chip";
import React from "react";

export type ChipsProps = {
  value: string[];
  onChange: (value: string[]) => void;
  style?: any;
  inputStyle?: any;
  inputProps?: TextInput;
};

const Chips: React.FC<ChipsProps> = ({
  value,
  onChange,
  style,
  inputStyle,
  inputProps,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <View style={[ChipsStyles.container, style]}>
      <TextInput
        style={[ChipsStyles.input, inputStyle]}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={() => {
          if (inputValue) {
            onChange([...value, inputValue]);
            setInputValue("");
          }
        }}
        {...inputProps}
      />
      {!!value.length && (
        <View style={[ChipsStyles.chipsList]}>
          {value.map((label, index) => (
            <Chip
              key={index}
              label={label}
              onRemove={() => {
                const newValue = [...value];
                newValue.splice(index, 1);
                onChange(newValue);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const ChipsStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  chipsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems : "center",
  }
});

export default Chips;
