import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {PaperProvider, MD3DarkTheme, Text, Icon} from 'react-native-paper';
import {Home} from './src/screens/Home';
import {Profile} from './src/screens/Profile';
import {BonusTaskWheel} from './src/screens/BonusTaskWheel';
import {AlbumScreen} from './src/screens/Album';
import {TaxiWorkQuizScreen} from './src/screens/TaxiWorkQuizScreen';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const TabBar = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        options={{
          tabBarIcon: () => {
            return <Icon size={25} source={'home'} />;
          },
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => {
            return <Icon size={25} source={'airballoon-outline'} />;
          },
        }}
        name="Bonus"
        component={BonusTaskWheel}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => {
            return <Icon size={25} source={'gamepad'} />;
          },
        }}
        name="Quiz"
        component={TaxiWorkQuizScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => {
            return <Icon size={25} source={'camera'} />;
          },
        }}
        name="Album"
        component={AlbumScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => {
            return <Icon size={25} source={'face-man-profile'} />;
          },
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export const App = () => {
  const {theme} = useMaterial3Theme();

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.dark.primary,
      background: theme.dark.background || MD3DarkTheme.colors.background,
      card: theme.dark.surface || MD3DarkTheme.colors.surface,
      text: theme.dark.onBackground || MD3DarkTheme.colors.onBackground,
      border: theme.dark.outline || MD3DarkTheme.colors.outline,
      notification: theme.dark.error || MD3DarkTheme.colors.error,
    },
  };

  const paperTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...theme.dark,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="TabBar" component={TabBar} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
};
