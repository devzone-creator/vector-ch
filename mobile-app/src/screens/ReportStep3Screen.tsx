import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportStep3Screen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Report Step 3</Text>
      <Text style={styles.subtext}>Report details and submission will be implemented here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default ReportStep3Screen;