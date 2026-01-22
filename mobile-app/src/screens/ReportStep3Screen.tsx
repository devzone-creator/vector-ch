import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { apiService, handleApiError } from '../services/api';
import { MediaItem, SeverityType } from '../types';

interface RouteParams {
  category: string;
  media?: MediaItem[];
}

export default function ReportStep3Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, media } = route.params as RouteParams;
  
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [severity, setSeverity] = useState<SeverityType>('MEDIUM');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const severityOptions: { value: SeverityType; label: string; color: string }[] = [
    { value: 'LOW', label: 'Low Priority', color: '#10b981' },
    { value: 'MEDIUM', label: 'Medium Priority', color: '#f59e0b' },
    { value: 'HIGH', label: 'High Priority', color: '#f97316' },
    { value: 'CRITICAL', label: 'Critical/Emergency', color: '#ef4444' },
  ];

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Location access is needed to pinpoint the issue location.',
          [{ text: 'OK' }]
        );
        setUseCurrentLocation(false);
        setIsLoadingLocation(false);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = locationResult.coords;
      
      // Reverse geocoding to get address
      const addressResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResult[0] 
        ? `${addressResult[0].street || ''} ${addressResult[0].city || ''}, ${addressResult[0].region || ''}`.trim()
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      setLocation({
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get current location. Please try again.');
      setUseCurrentLocation(false);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!location && useCurrentLocation) {
      Alert.alert('Location Required', 'Please wait for location to be detected or disable current location.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare media URIs for submission
      const mediaUris = media?.map(item => item.uri) || [];

      const reportData = {
        category,
        latitude: location?.latitude || 9.4034, // Default to Tamale if no location
        longitude: location?.longitude || -0.8424,
        location: location?.address || 'Location not specified',
        description: description.trim() || undefined,
        severity,
        media: mediaUris.length > 0 ? mediaUris : undefined,
      };

      const response = await apiService.submitReport(reportData);
      
      // Navigate to success screen
      navigation.navigate('Success' as never, { 
        reportId: response.reportId,
        message: response.message
      } as never);

    } catch (err) {
      const errorMessage = handleApiError(err);
      Alert.alert('Submission Failed', errorMessage);
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={[styles.progressStep, styles.activeStep]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 3</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Final details</Text>
        <Text style={styles.subtitle}>
          Add additional information to help authorities respond effectively
        </Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the issue in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.severityContainer}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.severityOption,
                  severity === option.value && { 
                    backgroundColor: option.color + '20',
                    borderColor: option.color 
                  }
                ]}
                onPress={() => setSeverity(option.value)}
              >
                <View style={[styles.severityIndicator, { backgroundColor: option.color }]} />
                <Text style={[
                  styles.severityText,
                  severity === option.value && { color: option.color, fontWeight: '600' }
                ]}>
                  {option.label}
                </Text>
                {severity === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color={option.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.locationToggle}>
            <View style={styles.locationToggleContent}>
              <Ionicons name="location" size={20} color="#2563eb" />
              <Text style={styles.locationToggleText}>Use current location</Text>
            </View>
            <Switch
              value={useCurrentLocation}
              onValueChange={setUseCurrentLocation}
              trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
              thumbColor={useCurrentLocation ? '#2563eb' : '#9ca3af'}
            />
          </View>

          {useCurrentLocation && (
            <View style={styles.locationInfo}>
              {isLoadingLocation ? (
                <View style={styles.locationLoading}>
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text style={styles.locationLoadingText}>Getting location...</Text>
                </View>
              ) : location ? (
                <View style={styles.locationDisplay}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.locationRetry} onPress={getCurrentLocation}>
                  <Ionicons name="refresh" size={16} color="#ef4444" />
                  <Text style={styles.locationRetryText}>Tap to retry location</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.section}>
          <View style={styles.anonymousToggle}>
            <View style={styles.anonymousToggleContent}>
              <Ionicons name="eye-off" size={20} color="#6b7280" />
              <View style={styles.anonymousText}>
                <Text style={styles.anonymousTitle}>Submit anonymously</Text>
                <Text style={styles.anonymousSubtitle}>Your identity will not be shared</Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
              thumbColor={isAnonymous ? '#2563eb' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Report Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Category:</Text>
            <Text style={styles.summaryValue}>{category.replace('_', ' ')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Evidence:</Text>
            <Text style={styles.summaryValue}>
              {media?.length ? `${media.length} photo${media.length > 1 ? 's' : ''}` : 'None'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Priority:</Text>
            <Text style={styles.summaryValue}>{severity}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="send" size={20} color="#ffffff" />
          )}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: '#2563eb',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  severityContainer: {
    gap: 8,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  severityText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationToggleText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  locationInfo: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLoadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationAddress: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  locationRetry: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRetryText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 8,
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  anonymousToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  anonymousText: {
    marginLeft: 12,
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  anonymousSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});