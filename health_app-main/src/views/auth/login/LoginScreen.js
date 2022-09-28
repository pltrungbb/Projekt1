import React, {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Loader from "../../_shared/loader";
import userService from "../../../service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonCss from '../../_shared/css.common';

const LoginScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const login = async () => {
        setLoading(true);
        await AsyncStorage.removeItem('user');
        const {data: users, error} = await userService.login(email, password);

        setLoading(false);

        if (!users[0] || error) {
            Alert.alert("Invalid email or password! Please check and try again.")
        } else {
            AsyncStorage.setItem('user', JSON.stringify(users[0]))
                    .then(() => navigation.navigate('Main', {screen: 'Home'}));
        }
    };

    return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <View>
                    <Text style={styles.title}>HEALTH APP</Text>
                </View>
                <Image source={require('../../../_assets/icon/logo.png')}
                       style={styles.loginIcon}
                />
                <View style={styles.loginBox}>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Email"
                               placeholderTextColor="#7F7F7F"
                               autoCapitalize="none"
                               onChangeText={(val) => setEmail(val)}
                    />
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Password"
                               placeholderTextColor="#7F7F7F"
                               autoCapitalize="none"
                               secureTextEntry={true}
                               onChangeText={(val) => setPassword(val)}
                    />
                    <TouchableOpacity style={commonCss.btnSubmit}
                                      onPress={login}>
                        <Text style={commonCss.btnSubmitText}> Login </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.registerLink}
                                      onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerText}>Don't have account? Register now </Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        flex: 2,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingLeft: 50,
        paddingRight: 50,
        // paddingTop: 100
    },
    title: {
        top: -100,
        marginBottom: 10,
        resizeMode: 'contain',
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        color: '#FF5B2C'
    },
    loginIcon: {
        width: 200,
        height: 100,
        marginLeft: 50,
        position: "relative",
        top: -80,
        left: 10,
        resizeMode: 'contain'
    },

    loginBox: {
        position: "relative",
        top: -50,

    },

    input: {
        margin: 15,
        height: 40,
        paddingLeft: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    submitButton: {
        backgroundColor: '#0077c2',
        padding: 10,
        margin: 15,
        alignItems: 'center',
        height: 40,
        borderRadius: 10
    },
    submitButtonText: {
        color: 'white',
    },

    registerLink: {
        textDecorationLine: "underline",
        marginTop: 5,
        marginLeft: 15
    },
    registerText: {
        color: '#0041FD',
        fontSize: 17,
        textDecorationLine: 'underline'
    },


});

export default LoginScreen;
