import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import WebView from "react-native-webview";
import 'react-native-get-random-values';
import workoutService from "../../service/workout.service";
import Loader from "../_shared/loader";

const Item = ({item}) => {

    return (
            <View style={styles.workoutItem}>
                <Text style={styles.workoutTitle}>{item.name.toUpperCase()}</Text>
                <Text style={styles.workoutDescription}>{item.description}</Text>
                <WebView style={styles.webviewYoutube}
                         javaScriptEnabled={true}
                         androidLayerType="software"
                         domStorageEnabled={true}
                         source={{uri: item.embedUrl}}
                />
            </View>
    );
}

const OptionFilter = ({callback}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('KEEP_WEIGHT');
    const [options, setOptions] = useState([
        {label: 'Keep Weight', value: 'KEEP_WEIGHT'},
        {label: 'Increase Weight', value: 'INCREASE_WEIGHT'},
        {label: 'Decrease Weight', value: 'DECREASE_WEIGHT'}
    ]);

    return (<DropDownPicker placeholder="Choose your option"
                            textStyle={{
                                fontSize: 18,
                                color: '#4c4c4c',
                            }}
                            style={{
                                backgroundColor: "#eeeeee",
                                borderColor:  "#eeeeee",
                                borderRadius: 20,
                            }}
                            containerStyle={styles.selectBox}
                            open={open}
                            value={value}
                            items={options}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setOptions}
                            onChangeValue={(val) => {
                                callback(val);
                            }}
            />
    )
}
const WorkoutScreen = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            await loadData('KEEP_WEIGHT');
        });
    }, [navigation]);

    const loadData = async (type) => {
        setLoading(true);
        await workoutService
                .getWorkoutsByType(type)
                .then(_data => {
                    const dataWithEmbedUrl = _data.map(item => {
                        item.embedUrl = item.url.replace('/watch?v=', '/embed/');
                        return item;
                    })
                    setData(dataWithEmbedUrl);
                    setLoading(false);
                });
    }

    return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <OptionFilter callback={(chosenOption) => loadData(chosenOption)}/>
                <View style={{marginTop: 20}}>
                    <FlatList data={data}
                              renderItem={({item}) => (<Item item={item}/>)}
                              keyExtractor={item => item.id}
                    />
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopColor: '#FFFFFF',
        borderTopWidth: 1,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
        paddingBottom: 60,
        height: '100%',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20
    },
    selectBox: {
        width: '100%',
        height: 50,
        textAlign: 'center',
        paddingBottom: 5,
        marginTop: 5,
        zIndex: 10,
        borderRadius: 15
    },

    workoutItem: {
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#eeeeee',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 15
    },
    workoutTitle: {
        marginBottom: 5,
        fontSize: 20,
        color: '#4c4c4c',
        fontWeight: 'bold'
    },
    workoutDescription: {
        marginBottom: 10,
        fontSize: 16,
        color: '#4c4c4c',
    },
    webviewYoutube: {
        height: 150,
    },
});

export default WorkoutScreen;
