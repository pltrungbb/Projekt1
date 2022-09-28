import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../_shared/loader";
import moment from "moment";
import dailyWaterService from "../../service/daily_water.service"

const Type = {
    INCREASE: 'increase',
    DECREASE: 'decrease'
}

const DailyWaterScreen = () => {
    const emptyGlassIcon = require('../../_assets/icon/empty_glass.png');
    const fullGlassIcon = require('../../_assets/icon/full_glass.png');

    const [glasses, setGlasses] = useState([
        {id: 1, icon: emptyGlassIcon, hour: '7:00'},
        {id: 2, icon: emptyGlassIcon, hour: '8:00'},
        {id: 3, icon: emptyGlassIcon, hour: '9:00'},
        {id: 4, icon: emptyGlassIcon, hour: '10:00'},
        {id: 5, icon: emptyGlassIcon, hour: '11:00'},
        {id: 6, icon: emptyGlassIcon, hour: '12:00'},
        {id: 7, icon: emptyGlassIcon, hour: '13:00'},
        {id: 8, icon: emptyGlassIcon, hour: '14:00'},
        {id: 9, icon: emptyGlassIcon, hour: '15:00'},
        {id: 10, icon: emptyGlassIcon, hour: '16:00'},
    ]);

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        readUserData().then();
    }, []);

    const readDailyWaterData = async (userId) => {
        await dailyWaterService.readDailyWater(userId)
                .then(numberFullGlass => {
                    let items = [...glasses];
                    setLoading(true);
                    for (const g of glasses) {
                        if (g.id <= numberFullGlass) {
                            g.icon = fullGlassIcon;
                        }
                    }
                    setLoading(false);
                    setGlasses(items);
                })
    }

    const readUserData = async () => {
        setLoading(true);
        try {
            const userStored = JSON.parse(await AsyncStorage.getItem('user'));
            await setUser(userStored);
            await readDailyWaterData(userStored.id);
            setLoading(false);
        } catch (e) {
            console.log(e)
            alert('Failed to fetch user info from storage', e);
            setLoading(false);
        }
    };


    return (
            <View style={styles.container}>
                <Loader loading={loading}/>

                {glasses.map((item, key) => {
                    const handlePress = async () => {
                        let items = [...glasses];
                        setLoading(true);
                        for (const g of glasses) {
                            if (g.id === item.id) {
                                if (g.icon === emptyGlassIcon) {
                                    await dailyWaterService.updateDailyWater(user.id, Type.INCREASE);
                                    setLoading(false);
                                    g.icon = fullGlassIcon;
                                } else {
                                    await dailyWaterService.updateDailyWater(user.id, Type.DECREASE);
                                    setLoading(false);
                                    g.icon = emptyGlassIcon;
                                }

                            }
                        }
                        setGlasses(items);
                    };

                    return (
                            <TouchableOpacity key={key}
                                              onPress={handlePress}
                                              style={styles.iconWrapper}>
                                <Image source={item.icon} style={styles.icon}/>
                                {/*<Text style={styles.hour}>{item.hour}</Text>*/}
                            </TouchableOpacity>
                    );
                })}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingTop: 50,
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F8F9FD',
        flexWrap: 'wrap',
        paddingLeft: 20,
        paddingRight: 20,
    },
    iconWrapper: {
        display: 'flex',
        height: 75,
        width: 75,
        margin: 15,
        backgroundColor: '#F8F9FD',
    },
    icon: {
        height: 75,
        width: 75,
    },
    hour: {
        textAlign: 'center'
    }
});


export default DailyWaterScreen;
