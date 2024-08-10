import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  data: any;
};
const CaregiverRequestCard: React.FC<Props> = ({ data }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}></View>
        <Text style={styles.title}>Caregiver Required in {data?.city}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text>{data.bookingStatus}</Text>
        <TouchableOpacity style={[styles.button, styles.bookButton]}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderBottomColor: "#F0F0F0",
    padding: 16,
  },
  cardBody: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: "#A6A3B8",
    height: 52,
    width: 52,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 35,
    marginVertical: 5,
    alignItems: "center",
  },
  bookButton: {
    backgroundColor: "#C2A27C",
  },
  goBackButton: {
    backgroundColor: "#C2A27C",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#ffffff",
  },
});

export default CaregiverRequestCard;
