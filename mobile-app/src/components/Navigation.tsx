import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportStep1Screen from '../screens/ReportStep1Screen';
import ReportStep2Screen from '../screens/ReportStep2Screen';
import ReportStep3Screen from '../screens/ReportStep3Screen';
import ReportSuccessScreen from '../screens/ReportSuccessScreen';

import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Navigation
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Main app with tabs */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        
        {/* Report flow screens */}
        <Stack.Screen 
          name="ReportStep1" 
          component={ReportStep1Screen}
          options={{ title: 'Report Issue' }}
        />
        <Stack.Screen 
          name="ReportStep2" 
          component={ReportStep2Screen}
          options={{ title: 'Add Media' }}
        />
        <Stack.Screen 
          name="ReportStep3" 
          component={ReportStep3Screen}
          options={{ title: 'Details' }}
        />
        <Stack.Screen 
          name="ReportSuccess" 
          component={ReportSuccessScreen}
          options={{ 
            title: 'Report Submitted',
            headerLeft: () => null, // Prevent going back
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}