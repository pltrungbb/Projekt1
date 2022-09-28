import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WorkoutScreen from '../views/workout/WorkoutScreen';
import {Image, StyleSheet} from 'react-native';
import HomeScreen from '../views/home/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import BmiScreen from '../views/bmi/BmiScreen';
import ProfileScreen from '../views/profile/ProfileScreen';
import DailyWaterScreen from '../views/dailywater/DailyWaterScreen';
import MealScreen from '../views/meal/MealScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
    const commonOption  ={
        headerStyle: {
            backgroundColor: '#eeeeee',
        },
        headerTitleStyle: {
            color: '#4C4C4C',
        },
        headerTintColor: '#4C4C4C'
    }

    return (
            <HomeStack.Navigator>
                <HomeStack.Screen name="Homepage"
                                  component={HomeScreen}
                                  options={{headerShown: false}}
                />
                <HomeStack.Screen name="Workout"
                                  component={WorkoutScreen}
                                  options={commonOption}
                />
                <HomeStack.Screen name="Meal"
                                  component={MealScreen}
                                  options={commonOption}
                />
                <HomeStack.Screen name="BMI Calculate"
                                  component={BmiScreen}
                                  options={commonOption}
                />
                <HomeStack.Screen name="Daily Water"
                                  component={DailyWaterScreen}
                                  options={commonOption}
                />
            </HomeStack.Navigator>
    );
};


const BottomTabNavigator = () => {
    return (
            <Tab.Navigator initRoute={'Home'}
                           style={styles.tab}
                           screenOptions={{
                               headerShown: false,
                               gestureEnabled: true,
                               gestureDirection: 'horizontal',
                               tabBarStyle: {
                                   height: 70,
                                   backgroundColor: '#eeeeee',
                               },
                           }}>
                <Tab.Screen name="Home"
                            options={{
                                tabBarIcon: () => {
                                    return <Image style={styles.icon} source={require('../_assets/icon/home.png')}/>;
                                },
                                tabBarShowLabel: false,
                                headerShown: false,
                            }}
                            component={HomeStackNavigator}/>
                <Tab.Screen name="Profile"
                            options={{
                                tabBarIcon: () => {
                                    return <Image style={styles.icon} source={require('../_assets/icon/profile.png')}/>;
                                },
                                tabBarShowLabel: false,
                            }}
                            component={ProfileScreen}/>
            </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    icon: {
        height: 40,
        width: 40,
        paddingTop: 10,
    },
    tab: {
        paddingTop: 10,
        backgroundColor: '#0E120A',
    },
});

export default BottomTabNavigator;
