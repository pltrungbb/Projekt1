import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Loader from '../_shared/loader';
import dailyMealService from '../../service/daily_meal.service';
import fixedMealService from '../../service/fixed_meal.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonCss from '../_shared/css.common';
import DropDownPicker from 'react-native-dropdown-picker';
import Dialog from "react-native-dialog";

const MealItem = (meal, updateFormFunc, confirmDeleteFunc) => {
    return (
            <View style={styles.mealItem}>
                <View style={styles.mealInfo}>
                    <Text style={styles.mealItemName}>{meal.name} - {meal.gram}g</Text>
                    <Text style={styles.mealItemDetail}>{meal.detail}</Text>
                    <Text style={styles.mealItemSubDetail}>{meal.calorie} kcal/100g ({meal.fat}g fat - {meal.protein}g protein - {meal.carb}g carb)</Text>
                </View>
                <View style={styles.mealActions}>
                    <TouchableOpacity style={styles.mealActionEdit}
                                      onPress={updateFormFunc}>
                        <Image source={require('../../_assets/icon/edit.png')}
                               style={{height: 25, width: 25}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mealActionDelete}
                                      onPress={confirmDeleteFunc}>
                        <Image source={require('../../_assets/icon/delete.png')}
                               style={{height: 25, width: 25}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    );
};

const MealScreen = ({navigation}) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');
    const [calorie, setCalorie] = useState(0);
    const [fat, setFat] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carb, setCarb] = useState(0);
    const [fixed, setFixed] = useState(false);
    const [gram, setGram] = useState(0);

    const [user, setUser] = useState({});
    const [meals, setMeals] = useState([]);

    const [open, setOpen] = useState(false);
    const [fixedMeal, setFixedMeal] = useState('');
    const [fixedMeals, setFixedMeals] = useState([]);
    const [showDialogGram, setShowDialogGram] = useState(false);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            readData().then();
        });
    }, [navigation]);

    const readData = async () => {
        setLoading(true);
        try {
            const userStored = JSON.parse(await AsyncStorage.getItem('user'));
            await setUser(userStored);
            await dailyMealService.getDailyMealsByUserId(userStored.id).then(_meal => setMeals(_meal ? _meal : []));
            await fixedMealService.getFixedMeal().then(_fm => setFixedMeals(_fm));

            resetForm();
        } catch (e) {
            console.log(e);
            alert('Failed to fetch user info from storage', e);
        }
        setLoading(false);
    };

    const calculateNumberCalories = () => {
        let count = 0;
        for (let meal of meals) {
            count += meal.calorie * meal.gram / 100;
        }
        return count;
    };

    const resetForm = () => {
        setId('');
        setName('');
        setDetail('');
        setCalorie('');
        setFat('');
        setProtein('');
        setCarb('');
        setFixed(false);
        setGram(0);
        setFixedMeal('');
        setShowDialogGram(false);
    };

    const saveMeal = async () => {
        setLoading(true);
        if (!name || !detail || Number.isNaN(calorie)) {
            Alert.alert('Please enter valid data');
            return;
        }
        await dailyMealService.saveDailyMeal(user.id, id, name, detail, calorie, fat, protein, carb, gram);
        await dailyMealService.getDailyMealsByUserId(user.id).then(_meal => setMeals(_meal ? _meal : []));
        setShowForm(false);
        resetForm();
        setLoading(false);
    };

    const showNewForm = () => {
        setShowForm(true);
    };

    const updateMeal = (meal) => {
        setId(meal.id);
        setName(meal.name);
        setDetail(meal.detail);
        setCalorie(meal.calorie);
        setFat(meal.fat);
        setProtein(meal.protein);
        setCarb(meal.carb);
        setGram(meal.gram);
        setShowForm(true);
    };

    const deleteMeal = (meal) => {
        Alert.alert('Are your sure?', 'Are you sure you want to delete this?', [
                    {
                        text: 'Yes', onPress: async () => {
                            setLoading(true);
                            await dailyMealService.deleteMeal(meal.id);
                            await dailyMealService.getDailyMealsByUserId(user.id).then(_meals => setMeals(_meals ? _meals : []));
                            setShowForm(false);
                            setLoading(false);
                        },
                    },
                    {text: 'No'},
                ],
        );
    };

    const handleCancelDialog = () => {
        setFixedMeal('');
        setShowDialogGram(false);
    }

    const handleSubmitDialog = async () => {
        setLoading(true);
        const fixedMealFull = fixedMeals.filter(f => f.id === fixedMeal)[0];
        if (fixedMealFull) {

            await dailyMealService.saveDailyMeal(
                    user.id, null, fixedMealFull.name,
                    fixedMealFull.detail, fixedMealFull.calorie, fixedMealFull.fat,
                    fixedMealFull.protein, fixedMealFull.carb, gram
            );

            await dailyMealService.getDailyMealsByUserId(user.id).then(_meal => setMeals(_meal ? _meal : []));
            resetForm();
        }
        setLoading(false);

        setFixedMeal('');
        setShowDialogGram(false);
    }

    if (showForm) {
        return (
                <ScrollView style={styles.container}>
                    <Loader loading={loading}/>
                    <Text style={styles.title}>
                        {id ? 'Update meal' : 'Add new meal'}
                    </Text>
                    <View>
                        <Text style={commonCss.label}>Name</Text>
                        <TextInput style={commonCss.input}
                                   underlineColorAndroid="transparent"
                                   placeholder="Name"
                                   autoCapitalize="none"
                                   placeholderTextColor="#a1a1a1"
                                   value={name?.toString()}
                                   onChangeText={setName}/>
                    </View>
                    <View>
                        <Text style={commonCss.label}>Detail</Text>
                        <TextInput style={commonCss.input}
                                   underlineColorAndroid="transparent"
                                   placeholder="Detail"
                                   placeholderTextColor="#a1a1a1"
                                   value={detail?.toString()}
                                   autoCapitalize="none"
                                   onChangeText={setDetail}/>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.8}}>
                            <Text style={commonCss.label}>Calorie (kcal/100g)</Text>
                            <TextInput style={commonCss.input}
                                       underlineColorAndroid="transparent"
                                       placeholder="Calorie (kcal)"
                                       keyboardType={'numeric'}
                                       placeholderTextColor="#a1a1a1"
                                       value={calorie?.toString()}
                                       autoCapitalize="none"
                                       onChangeText={setCalorie}/>
                        </View>
                        <View style={{flex: 0.8}}>
                            <Text style={commonCss.label}>Fat (per 100g)</Text>
                            <TextInput style={commonCss.input}
                                       underlineColorAndroid="transparent"
                                       placeholder="Fat (per 100g)"
                                       keyboardType={'numeric'}
                                       placeholderTextColor="#a1a1a1"
                                       value={fat?.toString()}
                                       autoCapitalize="none"
                                       onChangeText={setFat}/>
                        </View>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.8}}>
                            <Text style={commonCss.label}>Protein (per 100g)</Text>
                            <TextInput style={commonCss.input}
                                       underlineColorAndroid="transparent"
                                       placeholder="Protein (per 100g)"
                                       keyboardType={'numeric'}
                                       placeholderTextColor="#a1a1a1"
                                       value={protein?.toString()}
                                       autoCapitalize="none"
                                       onChangeText={setProtein}/>
                        </View>
                        <View style={{flex: 0.8}}>
                            <Text style={commonCss.label}>Carb (per 100g)</Text>
                            <TextInput style={commonCss.input}
                                       underlineColorAndroid="transparent"
                                       placeholder="Carb (per 100g)"
                                       keyboardType={'numeric'}
                                       placeholderTextColor="#a1a1a1"
                                       value={carb?.toString()}
                                       autoCapitalize="none"
                                       onChangeText={setCarb}/>
                        </View>
                    </View>
                    <View>
                        <Text style={commonCss.label}>Quantity (g)</Text>
                        <TextInput style={commonCss.input}
                                   underlineColorAndroid="transparent"
                                   placeholder="Quantity (g)"
                                   keyboardType={'numeric'}
                                   placeholderTextColor="#a1a1a1"
                                   value={gram?.toString()}
                                   autoCapitalize="none"
                                   onChangeText={setGram}/>
                    </View>
                    <TouchableOpacity
                            style={commonCss.btnSubmit}
                            onPress={saveMeal}>
                        <Text style={commonCss.btnSubmitText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                            style={styles.backToListButton}
                            onPress={() => {
                                setShowForm(false);
                                resetForm();
                            }}>
                        <Text style={styles.backToListText}>
                            Back to meal list</Text>
                    </TouchableOpacity>

                </ScrollView>
        );
    } else {
        return (
                <View style={styles.container}>
                    <View style={{marginBottom: 15}}>
                        <Text style={styles.title}>Your calories for today:</Text>
                        <Text style={styles.title}>{calculateNumberCalories()} kcal</Text>
                    </View>

                    <Dialog.Container visible={showDialogGram}>
                        <Dialog.Description>
                            <View>
                                <Text style={commonCss.label}>Quantity (g)</Text>
                                <TextInput style={{...commonCss.input, width: '100%'}}
                                           underlineColorAndroid="transparent"
                                           placeholder="Quantity (g)"
                                           keyboardType={'numeric'}
                                           placeholderTextColor="#a1a1a1"
                                           value={gram?.toString()}
                                           autoCapitalize="none"
                                           onChangeText={setGram}/>
                            </View>
                        </Dialog.Description>

                        <Dialog.Button label="Cancel" onPress={handleCancelDialog}/>
                        <Dialog.Button label="OK" onPress={handleSubmitDialog}/>
                    </Dialog.Container>
                    <DropDownPicker placeholder="Choose meal"
                                    textStyle={{
                                        fontSize: 18,
                                        color: '#4c4c4c',
                                    }}
                                    style={{
                                        backgroundColor: '#eeeeee',
                                        borderColor: '#eeeeee',
                                        borderRadius: 20,
                                        paddingLeft: 20,
                                    }}
                                    containerStyle={styles.selectBox}
                                    open={open}
                                    value={fixedMeal}
                                    items={fixedMeals.map(item => ({
                                        label: item.name + ' - ' + item.calorie + 'kcal/100g',
                                        value: item.id
                                    }))}
                                    setOpen={setOpen}
                                    setValue={setFixedMeal}
                                    onChangeValue={(val) => {
                                        setFixedMeal(val);
                                        if (val) {
                                            setShowDialogGram(true);
                                        }
                                    }}
                    />
                    <FlatList style={{marginTop: 15}}
                              data={meals}
                              renderItem={({item}) => MealItem(item,
                                      () => updateMeal(item),
                                      () => deleteMeal(item),
                              )}
                              keyExtractor={(_item, index) => `meal_${index}`}
                    />

                    <TouchableOpacity style={styles.addButton}
                                      onPress={showNewForm}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        paddingTop: 30,
        display: 'flex',
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
        height: '100%',
    },
    title: {
        textAlign: 'center',
        color: '#4C4C4C',
        fontSize: 22,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    mealItem: {
        height: 90,
        borderColor: '#F1F3F7',
        backgroundColor: '#F1F3F7',
        borderWidth: 1,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 5,
        marginBottom: 20,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
    },
    mealInfo: {
        width: '75%',
    },
    mealActions: {
        display: 'flex',
        flexDirection: 'row',
    },
    mealActionEdit: {
        display: 'flex',
        marginLeft: 10,
    },
    mealActionDelete: {
        display: 'flex',
        marginLeft: 10,
    },

    mealItemName: {
        fontSize: 20,
        color: '#4c4c4c',
        fontWeight: 'bold',
    },

    mealItemDetail: {
        fontSize: 13,
        color: '#4c4c4c',
    },

    mealItemSubDetail: {
        fontSize: 12,
        color: '#4c4c4c',
    },

    addButton: {
        fontSize: 100,
        borderWidth: 1,
        backgroundColor: '#FF5B2C',
        borderColor: '#FF5B2C',
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        bottom: 40,
        right: 15,
        shadowColor: '#000000',
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },

    addButtonText: {
        fontSize: 30,
        color: 'white',
    },

    backToListButton: {
        textDecorationLine: 'underline',
        marginTop: 5,
        marginLeft: '30%',
        textAlign: 'center',
    },

    backToListText: {
        color: '#FF7E59',
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 10,
        textDecorationLine: 'underline',
    },
});


export default MealScreen;
