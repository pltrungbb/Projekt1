import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Loader from '../_shared/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../../service/user.service';
import commonCss from '../_shared/css.common';

const ProfileScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [birthday, setBirthday] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        return navigation.addListener('focus', () => {
            readData().then(setPassword(''));
        });
    }, [navigation]);

    const readData = async () => {
        setLoading(true);
        try {
            const userStored = JSON.parse(await AsyncStorage.getItem('user'));
            await setUser(userStored);
            await setName(userStored.name);
            await setEmail(userStored.email);
            await setBirthday(userStored.birthday);
            await setPassword('');
            setLoading(false);
        } catch (e) {
            console.log(e);
            alert('Failed to fetch user info from storage', e);
            setLoading(false);
        }
    };

    const updateInfo = async () => {
        setLoading(true);
        const {data: _user, error} = await userService.updateProfile(password, name, birthday, user.id);
        if (error) {
            console.log(error);
            Alert.alert('An error has occurred when updating profile! Please try again.');
        } else {
            Alert.alert('Update profile successfully!');
            await AsyncStorage.setItem('user', JSON.stringify(_user));
            setLoading(false);
        }
    };

    const logout = async () => {
        Alert.alert('Are your sure?', 'Are you sure you want to logout?', [
                    {text: 'Yes', onPress: () => AsyncStorage.removeItem('user').then(navigation.navigate('Login'))},
                    {text: 'No'},
                ],
        );
    };

    return (
            <ScrollView style={styles.container}>
                <Loader loading={loading}/>
                <Text style={styles.title}>Profile</Text>
                <View>
                    <Text style={commonCss.label}>Email</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Email"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               value={email?.toString()}
                               editable={false}
                    />

                    <Text style={commonCss.label}>Name</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Name"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               value={name?.toString()}
                               onChangeText={setName}
                    />

                    <Text style={commonCss.label}>Birthday</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Birthday"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               value={birthday?.toString()}
                               onChangeText={setBirthday}
                    />

                    <Text style={commonCss.label}>Password</Text>
                    <TextInput style={commonCss.input}
                               underlineColorAndroid="transparent"
                               placeholder="Password"
                               placeholderTextColor="#a1a1a1"
                               autoCapitalize="none"
                               secureTextEntry={true}
                               value={password?.toString()}
                               onChangeText={setPassword}
                    />
                    <View style={{marginTop: 20}}>
                        <TouchableOpacity style={commonCss.btnSubmit}
                                          onPress={updateInfo}>
                            <Text style={commonCss.btnSubmitText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton}
                                          onPress={logout}>
                            <Text style={styles.logoutText}>If you want to logout? Click here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderTopWidth: 1,
        flex: 2,
        paddingTop: '10%',
        borderTopColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        paddingLeft: 50,
        paddingRight: 50,
    },
    title: {
        textAlign: 'center',
        color: '#4c4c4c',
        fontSize: 32,
        marginBottom: 15,
        fontWeight: 'bold'
    },

    logoutButton: {
        // width: 100,
        // backgroundColor: '#ff1f00',
        // paddingTop: 7,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 10,
        // alignItems: 'center',
        // height: 45,
        // borderRadius: 10,
    },

    logoutText: {
        color: 'red',
        fontSize: 18,
        textDecorationLine: 'underline'
    },
});

export default ProfileScreen;
