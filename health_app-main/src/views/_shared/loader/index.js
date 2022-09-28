import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';

const Loader = (props) => {
    const {loading} = props;

    return (
            <Modal transparent={true}
                   visible={loading}
                   animationType={'none'}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                                animating={true}
                                color="#000000"
                                size="large"
                                style={styles.activityIndicator}
                        />
                    </View>
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
        alignItems: 'center',
        flexDirection: 'column',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-around',
        display: 'flex',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});

export default Loader;
