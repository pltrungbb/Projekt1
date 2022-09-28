import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {menus} from './menu';
import dailyWaterService from '../../service/daily_water.service';
import Loader from '../_shared/loader';
import moment from 'moment';

const MenuItem = ({menu, index, navigation}) => {
    return (<TouchableOpacity key={index}
                              style={{...styles.menu, ...menu.customStyle}}
                              onPress={() => navigation.navigate(menu.screen)}>
                <Image style={styles.menuIcon} source={menu.icon}/>
                <Text style={styles.menuTitle}>{menu.name}</Text>
            </TouchableOpacity>
    );
};

const HomeScreen = ({navigation}) => {
    const [user, setUser] = useState({});
    const [time, setTime] = useState('');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setTime(moment(new Date()).format('MMM DD, YYYY'));
            readData().then();
        });
    }, [navigation]);

    const readDailyWaterData = async (userId) => {
        await dailyWaterService
                .readDailyWater(userId)
                .then(numberFullGlass => setProgress((numberFullGlass || 0) / 10 * 100));
    };

    const readData = async () => {
        setLoading(true);
        try {
            const userStored = JSON.parse(await AsyncStorage.getItem('user'));
            if (!userStored.id) {
                navigation.navigate('Login');
            }
            await setUser(userStored);
            await readDailyWaterData(userStored.id);
        } catch (e) {
            alert('Failed to fetch user info from storage', e);
        }
        setLoading(false);
    };

    return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <View>
                    <Text style={styles.title}>Hello, </Text>
                    <Text style={styles.title}>{user.name}</Text>
                </View>

                <View style={{position: 'relative', top: 5}}>
                    <Text style={styles.subTitle}>{time}</Text>
                </View>
                <View style={styles.progress}>
                    <View>
                        <Text style={styles.progressText}>Daily water progress</Text>
                    </View>
                    <View>
                        <Text style={styles.percentText}>{progress + '%'}</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={{
                            backgroundColor: '#FF7E59',
                            width: progress + '%',
                            height: 13,
                            borderRadius: 10,
                        }}/>
                    </View>
                </View>
                <View style={{marginTop: 5}}>
                    <Text style={styles.subTitle}>
                        Categories
                    </Text>
                    <View style={styles.menus}>
                        {
                            menus.map((menu, index) => {
                                return <MenuItem menu={menu} key={index} index={index} navigation={navigation}/>;
                            })
                        }
                    </View>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        backgroundColor: '#F8F9FD',
        paddingBottom: 30,
        height: '100%',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        color: '#4C4C4C',
        fontWeight: '500',
        fontSize: 35,
    },
    subTitle: {
        fontSize: 23,
        color: '#4c4c4c',
        paddingBottom: 5,
        fontWeight: 'bold'
    },
    time: {
        color: '#4C4C4C',
        fontWeight: '500',
        fontSize: 18,
    },
    menus: {
        position: 'relative',
        // top: -10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',

    },

    menu: {
        width: (Dimensions.get('window').width - 50) * 0.5,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 25,
    },

    menuIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    menuTitle: {
        marginTop: 16,
        color: '#4c4c4c',
        fontWeight: 'bold',
        fontSize: 20,
    },
    percentText: {
        marginTop: 5,
        fontSize: 18,
        color: 'black',
    },

    progress: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 25,
        height: 120,
    },

    progressText: {
        fontSize: 23,
        color: '#4c4c4c',
        fontWeight: 'bold',
    },

    progressBar: {
        marginTop: 5,
        height: 15,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#facec2',
        borderWidth: 1,
        borderRadius: 10,
    },
});

export default HomeScreen;
