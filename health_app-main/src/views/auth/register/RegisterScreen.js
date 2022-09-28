import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Loader from "../../_shared/loader";
import userService from "../../../service/user.service"
import commonCss from '../../_shared/css.common';

const RegisterScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');

    const register = async () => {
        setLoading(true);

        const {data: user, error} = await userService.register(email, password, name, birthday);
        if (error) {
            console.log(error)
        } else {
            Alert.alert("You have registered successfully!");
            setLoading(true);
            navigation.navigate('Login')
        }
    };

    return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <View style={{
                    // borderRadius: 10,
                    // borderColor: '#FF7E59',
                    // borderWidth: 1,
                    paddingTop: 25,
                    paddingBottom: 50,
                    paddingLeft: 20,
                    paddingRight: 20
                }}>

                    <Text style={commonCss.label}>Name</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Name"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               onChangeText={setName}
                    />

                    <Text style={commonCss.label}>Email</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Email"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               onChangeText={setEmail}
                    />

                    <Text style={commonCss.label}>Birthday</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Birthday"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               onChangeText={setBirthday}
                    />

                    <Text style={commonCss.label}>Password</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Password"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               secureTextEntry={true}
                               onChangeText={setPassword}
                    />
                    <View style={{marginTop: 20}}>
                        <TouchableOpacity style={commonCss.btnSubmit}
                                          onPress={register}>
                            <Text style={commonCss.btnSubmitText}>Register</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop: 50,
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20
    },
    input: {
        margin: 15,
        marginTop: 3,
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

    label: {
        marginLeft: 15,
        fontWeight: 'bold',
        color: 'black'
    }
});

export default RegisterScreen;
