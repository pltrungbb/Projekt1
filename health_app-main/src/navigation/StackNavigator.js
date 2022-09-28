import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../views/SplashScreen';
import LoginScreen from '../views/auth/login/LoginScreen';
import RegisterScreen from '../views/auth/register/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
            <Stack.Navigator>
                <Stack.Screen name="Splash"
                              component={SplashScreen}
                              options={{headerShown: false}}
                />
                <Stack.Screen name="Login"
                              component={LoginScreen}
                              options={{headerShown: false}}
                />
                <Stack.Screen name="Register"
                              component={RegisterScreen}
                />
                <Stack.Screen name="Main"
                              component={BottomTabNavigator}
                              options={{headerShown: false}}
                />
            </Stack.Navigator>
    );
};

export {MainStackNavigator};
