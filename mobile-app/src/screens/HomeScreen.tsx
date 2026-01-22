import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService, type Report } from '../services/api';

type CategoryType = 'RUBBISH' | 'UNSAFE_AREA' | 'SUSPICIOUS_ACTIVITY' | 'VANDALISM';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: (CategoryType | 'All')[] = ['All', 'RUBBISH', 'UNSAFE_AREA', 'SUSPICIOUS_ACTIVITY', 'VANDALISM'];

  // Map backend types to display names
  const getCategoryDisplayName = (category: CategoryType | 'All') => {
    switch (category) {
      case 'RUBBISH': return 'Rubbish';
      case 'UNSAFE_AREA': return 'Unsafe Area';
      case 'SUSPICIOUS_ACTIVITY': return 'Suspicious Activity';
      case 'VANDALISM': return 'Vandalism';
      default: return category;
    }
  };

  // Fetch reports from API
  const fetchReports = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const filters = selectedCategory === 'All' ? {} : { type: selectedCategory };
      const response = await apiService.getReports(filters);
      setReports(response.reports);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
      Alert.alert('Error', 'Failed to load reports. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory]);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'RUBBISH': return '#f59e0b';
      case 'UNSAFE_AREA': return '#ef4444';
      case 'SUSPICIOUS_ACTIVITY': return '#8b5cf6';
      case 'VANDALISM': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return '#10b981';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'REVIEWING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderReportCard = (report: Report) => (
    <View key={report.id} style={styles.reportCard}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {report.mediaUrls && report.mediaUrls.length > 0 ? (
          <Image
            source={{ uri: report.mediaUrls[0] }}
            style={styles.reportImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.reportImage, styles.noImagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#9ca3af" />
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
        
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(report.type) }]}>
          <Text style={styles.categoryBadgeText}>
            {getCategoryDisplayName(report.type as CategoryType)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.reportContent}>
        <Text style={styles.reportLocation}>{report.location}</Text>
        {report.description && (
          <Text style={styles.reportDescription} numberOfLines={2}>
            {report.description}
          </Text>
        )}
        
        <View style={styles.reportFooter}>
          <Text style={styles.timestamp}>{formatTimestamp(report.createdAt)}</Text>
          <View style={styles.rightSection}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
              <Text style={styles.statusText}>
                {report.status.replace('_', ' ')}
              </Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SeeIt</Text>
          <Text style={styles.subtitle}>Community Reports</Text>
        </View>
        <TouchableOp
          <Ionicons name="filter" />
        </TouchableOpacity>
      </View>

      {/* Category Pills *
      <ScrollView
        horizontal
        showsHoe}
        style={styles.categoriesContainer}
        contentCont
      >
        {ca => (
          <TouchableOpacity
tegory}
            onPress={y)}
            style
              styles.categoryP
              selectedCa
            ]}
          >
       Text
              style={[
                stylellText,
                selectedCategory === category &extActive,
              ]}
            >
              {ge
          /Text>
y>
        ))}
      </ScrollView>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        refreshControl={
          <RefreshControl refre)} />
        }
      >
(
          <View style={styler}>
            <Text style={styles.ext>
          </View>
        ) : error ? (
          <View s}>
          t>

              <Text style={
            </TouchableOpacity>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#9ca3af" />
            <Textt>
          e!</Text>
          </View>
(
          reports.map(renderReportCa
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const style
  co
  : 1,

  },
  header: {
    flexDire
    justifyContent: 'space-betw,
    ',
    padding 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    7',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButton: {
    padding: 8,
  },
  car: {
    backgroundCol
    borderBotto,
    borderBottomColo',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  call: {
    paddingHorizonta
    paddingVertical: 8,
    marginRight: 8,
    ,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColorb',
  },
  categoryPillText: {
    ,
    color: '#374151',
    fontWeight: '500',
  },
  categoryPillTextAct{
    color: 'white',
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  re {
    backgrou
    borderRaius: 16,
     8,
    shadowColor: '#0',
    shadowOf
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 're,
  },
  re
    width: '100%',
    height: 200,
    borderTopLeftRadi 16,
    borderTopRightRadius
  },
  noImagePlaceho{
    backgroundColof6',
    justifyContent: 'center',
    alignItems: 'center
  },
  noImageText: {
    ,
    fontSize: 14,
    color: '#9ca3af',
  },
  caBadge: {
    position: ,
    top: 12,
    left: 12,
    paddingHorizontal,
    paddingVertical: 4,
    
  },
  categoryBadgeTe
    color: 'white
    fontSize: 12,
    fontWeight: '600',
  },
  reportContent: {
    padding: 16,
  },
  reportLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    ,
  },
  reportFooter: {
    flexDirectio,
    ,
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth:
    
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rightSection: 
    flexDirectionrow',
    alignItems: 'center',
  },
  st
    paddingHorizonl: 8,
    paddingVertical: 4,
    borderRa
    marginRig
  },
  statusText: {
    color: 'white',
    
    fontWeight: '600',
    textTransformase',
  },
  detailsButton: {
    
    paddingVertica4,
  },
  de{
    color: '#2563',
    fontSize: 12,
    ',
  },
  loadingContaine
    flex: 1,
    justifyContent: '
    r',
    paddingVertical: 4
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical,
  },
  errorText: {
    ,
    color: '#ef4444',
    marginBottom:,
    textAlign: 'cente
  },
  retryButton: {
    paddingHorizontal: 16
    paddingVertical: 8,
    
    borderRadius
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent:nter',
    alignItems: 'cente
    48,
  },
  emptyText: {
    fontSize: 18,
    ,
    marginTop: 16,
    fontWeight: '
  },
  emptySubtext: {
    ,
    colo',
    marginTop: 4,
  },
});