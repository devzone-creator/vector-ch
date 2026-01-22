import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { MediaItem } from '../types';

interface RouteParams {
  category: string;
}

export default function ReportStep2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params as RouteParams;
  const [media, setMedia] = useState<MediaItem[]>([]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are needed to capture evidence.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMedia: MediaItem = {
        uri: result.assets[0].uri,
        type: 'image',
        name: `photo_${Date.now()}.jpg`,
      };
      setMedia(prev => [...prev, newMedia]);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newMedia: MediaItem[] = result.assets.map((asset, index) => ({
        uri: asset.uri,
        type: 'image' as const,
        name: `image_${Date.now()}_${index}.jpg`,
      }));
      setMedia(prev => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    navigation.navigate('ReportStep3' as never, { 
      category, 
      media: media.length > 0 ? media : undefined 
    } as never);
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
        <Text style={styles.headerTitle}>Add Evidence</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressText}>Step 2 of 3</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add photos or videos</Text>
        <Text style={styles.subtitle}>
          Visual evidence helps authorities understand and respond to the issue more effectively
        </Text>

        {/* Media Capture Options */}
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureIconContainer}>
              <Ionicons name="camera" size={32} color="#2563eb" />
            </View>
            <Text style={styles.captureButtonText}>Take Photo</Text>
            <Text style={styles.captureButtonSubtext}>Use camera to capture evidence</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={pickFromGallery}>
            <View style={styles.captureIconContainer}>
              <Ionicons name="images" size={32} color="#2563eb" />
            </View>
            <Text style={styles.captureButtonText}>Choose from Gallery</Text>
            <Text style={styles.captureButtonSubtext}>Select existing photos</Text>
          </TouchableOpacity>
        </View>

        {/* Media Preview */}
        {media.length > 0 && (
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaTitle}>Added Evidence ({media.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
              {media.map((item, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Skip Option */}
        <View style={styles.skipContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.skipText}>
            Adding evidence is optional but recommended for faster resolution
          </Text>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {media.length > 0 ? `Continue with ${media.length} photo${media.length > 1 ? 's' : ''}` : 'Skip and Continue'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
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
  captureContainer: {
    gap: 16,
    marginBottom: 24,
  },
  captureButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  captureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  captureButtonSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  mediaContainer: {
    marginBottom: 24,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  mediaScroll: {
    flexDirection: 'row',
  },
  mediaItem: {
    position: 'relative',
    marginRight: 12,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  skipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  skipText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});