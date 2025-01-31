import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect, useRef} from 'react';
import {Animated, View, ImageBackground, StyleSheet} from 'react-native';
import {PaperProvider, MD3DarkTheme, Text, Icon} from 'react-native-paper';
import {Home} from './src/screens/Home';
import {Profile} from './src/screens/Profile';
import {BonusTaskWheel} from './src/screens/BonusTaskWheel';
import {AlbumScreen} from './src/screens/Album';
import {TaxiWorkQuizScreen} from './src/screens/TaxiWorkQuizScreen';
import Toast from 'react-native-toast-message';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

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
  const Route = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="TabBar" component={TabBar} />
      </Stack.Navigator>
    );
  };

  ///////// Louder
  const [louderIsEnded, setLouderIsEnded] = useState(false);
  const appearingAnim = useRef(new Animated.Value(0)).current;
  const appearingSecondAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(appearingSecondAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }).start();
      //setLouderIsEnded(true);
    }, 100);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLouderIsEnded(true);
    }, 6000);
  }, []);

  const Louders = () => {
    return (
      <View
        style={{
          position: 'relative',
          flex: 1,
          backgroundColor: 'rgba(28,27,30,255)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.Text
          style={{
            opacity: appearingSecondAnim,
            color: '#9856c4',
            fontSize: 80,
            fontWeight: 'bold',
          }}>
          Days
        </Animated.Text>
        <Animated.Text
          style={{
            opacity: appearingSecondAnim,
            color: '#9856c4',
            fontSize: 80,
            fontWeight: 'bold',
          }}>
          Planing
        </Animated.Text>
      </View>
    );
  };
  /////////////////////////
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
        {!louderIsEnded ? <Louders /> : <Route />}
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
};
