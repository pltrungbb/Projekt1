import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../../service/user.service';
import Loader from '../_shared/loader';
import commonCss from '../_shared/css.common';

const BmiScreen = () => {
    const [user, setUser] = useState({});
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState('');
    const [bmiResult, setBmiResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultColor, setResultColor] = useState('white');

    useEffect(() => {
        readData().then();
    }, []);

    const readData = async () => {
        setLoading(true);
        try {
            const userStored = JSON.parse(await AsyncStorage.getItem('user'));
            setUser(userStored);
            if (userStored.height) {
                await setHeight(userStored.height);
            }
            if (userStored.weight) {
                await setWeight(userStored.weight);
            }
            await calculateBmi(userStored.height, userStored.weight);
        } catch (e) {
            console.log(e);
            alert('Failed to fetch user info from storage', e);
        }
        setLoading(false);
    };


    const calculateBmi = async (defaultHeight, defaultWeight) => {
        if ((!defaultHeight || !defaultWeight) && (!height || !weight)) {
            return;
        }

        const newHeight = defaultHeight | height;
        const newWeight = defaultWeight | weight;

        let result = (parseFloat(newWeight) * 10000) / (parseFloat(newHeight) * parseFloat(newHeight));
        result = result.toFixed(2);
        setBmi(result);

        let _bmiResult = '';
        if (result < 18.5) {
            _bmiResult = 'Underweight';
        } else if (result >= 18.5 && result < 25) {
            _bmiResult = 'Normal weight'
        } else if (result >= 25 && result < 30) {
            _bmiResult = 'Overweight'
        } else if (result >= 30) {
            _bmiResult = 'Obese'
        } else {
            alert('Incorrect Input!');
        }
        setBmiResult(_bmiResult);
        updateResultColor(_bmiResult);

        if (height) {
            const {data: userRes, error} = await userService.updateBmi(result, weight, height, user.id);
            setUser(userRes[0]);
            await AsyncStorage.setItem('user', JSON.stringify(userRes[0]));
        }
    };

    const updateResultColor = (_bmiResult) => {
        if (_bmiResult === 'Underweight') {
            setResultColor('#FF7E59');
        } else if (_bmiResult === 'Normal weight') {
            setResultColor('#0041FD');
        } else if (_bmiResult === 'Overweight') {
            setResultColor('#FF5B2C');
        } else if (_bmiResult === 'Obese') {
            setResultColor('#E60023');
        } else {
            setResultColor('white');
        }

    };

    return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <Text style={commonCss.label}>Height (cm)</Text>
                <TextInput style={commonCss.input}
                           underlineColorAndroid="transparent"
                           placeholder="Height (cm)"
                           placeholderTextColor="#a1a1a1"
                           autoCapitalize="none"
                           keyboardType={'numeric'}
                           value={height?.toString()}
                           onChangeText={setHeight}/>

                <Text style={commonCss.label}>Weight (kg)</Text>
                <TextInput style={commonCss.input}
                           underlineColorAndroid="transparent"
                           placeholder="Weight (kg)"
                           placeholderTextColor="#a1a1a1"
                           keyboardType={'numeric'}
                           value={weight?.toString()}
                           autoCapitalize="none"
                           onChangeText={setWeight}/>

                <TouchableOpacity
                        style={commonCss.btnSubmit}
                        onPress={calculateBmi}>
                    <Text style={commonCss.btnSubmitText}>Calculate</Text>
                </TouchableOpacity>

                {
                    bmi && bmiResult &&
                    <View style={{paddingTop: 30}}>
                        <Text style={styles.resultText}>Your BMI: {bmi}</Text>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 25,
                            paddingTop: 10,
                            fontWeight: 'bold',
                            color: resultColor,
                        }}>{bmiResult.toUpperCase()}</Text>
                    </View>
                }

            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopColor: '#FFFFFF',
        borderTopWidth: 1,
        paddingTop: '20%',
        backgroundColor: '#FFFFFF',
        paddingBottom: 60,
        height: '100%',
        paddingLeft: 50,
        paddingRight: 50,
    },
    title: {
        paddingBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    resultText: {
        textAlign: 'center',
        fontSize: 25,
        color: '#4c4c4c',
        fontWeight: 'bold'
    },
    label: {
        marginLeft: 15,
        paddingBottom: 5,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default BmiScreen;
