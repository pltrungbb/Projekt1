import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {MainStackNavigator} from "./navigation/StackNavigator";


const App: () => Node = () => {
    return (
            <NavigationContainer>
                <MainStackNavigator/>
            </NavigationContainer>
    );
};

export default App;
