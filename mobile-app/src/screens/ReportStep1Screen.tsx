import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CategoryType, getCategoryDisplayName, getCategoryColor, RootStackParamList } from '../types';

type ReportStep1NavigationProp = StackNavigationProp<RootStackParamList, 'ReportStep1'>;

const ReportStep1Screen: React.FC = () => {
  const navigation = useNavigation<ReportStep1NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const categories = [
    { 
      id: 'RUBBISH' as CategoryType,
      name: 'Rubbish',
      icon: 'trash-outline',
      description: 'Litter, illegal dumping, overflowing bins'
    },
    { 
      id: 'UNSAFE_AREA' as CategoryType,
      name: 'Unsafe Area',
      icon: 'warning-outline',
      description: 'Broken infrastructure, hazards, poor lighting'
    },
    { 
      id: 'SUSPICIOUS_ACTIVITY' as CategoryType,
      name: 'Suspicious Activity',
      icon: 'eye-outline',
      description: 'Unusual behavior, security concerns'
    },
    { 
      id: 'VANDALISM' as CategoryType,
      name: 'Vandalism',
      icon: 'brush-outline',
      description: 'Graffiti, property damage, defacement'
    },
  ];

  const handleContinue = () => {
    if (selectedCategory) {
      navigation.navigate('ReportStep2', { category: selectedCategory });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressStepActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressText}>Step 1 of 3</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What are you reporting?</Text>
          <Text style={styles.subtitle}>
            Select the category that best describes the issue
          </Text>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const categoryColor = getCategoryColor(category.id);

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryCard,
                  isSelected && { 
                    backgroundColor: categoryColor,
                    borderColor: categoryColor,
                  }
                ]}
              >
                <View style={styles.categoryContent}>
                  <View style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerSelected
                  ]}>
                    <Ionicons
                      name={category.icon as any}
                      size={32}
                      color={isSelected ? 'white' : categoryColor}
                    />
                  </View>
                  
                  <View style={styles.categoryText}>
                    <Text style={[
                      styles.categoryName,
                      isSelected && styles.categoryNameSelected
                    ]}>
                      {category.name}
                    </Text>
                    <Text style={[
                      styles.categoryDescription,
                      isSelected && styles.categoryDescriptionSelected
                    ]}>
                      {category.description}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedCategory}
          style={[
            styles.continueButton,
            !selectedCategory && styles.continueButtonDisabled
          ]}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedCategory && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryNameSelected: {
    color: 'white',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  categoryDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  continueButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default ReportStep1Screen;