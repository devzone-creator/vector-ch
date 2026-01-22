import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface SuccessScreenParams {
  reportId: string;
  message: string;
}

export default function SuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as SuccessScreenParams;

  const handleGoHome = () => {
    navigation.navigate('MainTabs' as never);
  };

  const handleViewReport = () => {
    // Navigate to report details (implement later)
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#10b981" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Report Submitted Successfully!</Text>
        <Text style={styles.subtitle}>
          {params?.message || 'Your report has been received and will be reviewed by the authorities.'}
        </Text>

        {/* Report ID */}
        {params?.reportId && (
          <View style={styles.reportIdContainer}>
            <Text style={styles.reportIdLabel}>Report ID:</Text>
            <Text style={styles.reportId}>{params.reportId}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewReport}>
            <Text style={styles.secondaryButtonText}>View My Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.infoText}>
            You will receive updates on your report status. Thank you for helping keep our community safe.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  reportIdContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: 'center',
  },
  reportIdLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  reportId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});