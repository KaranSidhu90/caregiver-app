import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  skills: string;
};

const Skills: React.FC<Props> = ({ skills }) => {
  const skillsArray = skills ? skills.split(', ') : [];

  return (
    <View style={styles.container}>
      {skillsArray.length > 0 ? (
        skillsArray.map((skill, index) => (
          <View key={index} style={styles.skillItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noSkillsText}>No skills available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 18,
    color: '#4A4A4A',
    marginRight: 10,
  },
  skillText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
  noSkillsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default Skills;
