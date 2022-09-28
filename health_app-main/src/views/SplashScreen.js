import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {

    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('user').then((user) => {
                        navigation.replace(JSON.parse(user)?.id ? 'Main' : 'Login');
                    },
            );

        }, 2000);
    }, []);

    return (
            <View style={styles.container}>
                <Image
                        source={require('../_assets/icon/splash.png')}
                        style={styles.image}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#424242',
    },
    image: {
        height: '100%',
        resizeMode: 'contain',
    },
});


export default SplashScreen;
