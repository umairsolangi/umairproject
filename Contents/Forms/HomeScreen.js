import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Main Form</Text>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.addUserButton]}>
                    <Text style={styles.buttonText}>Add User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.viewAllUsersButton]}>
                    <Text style={styles.buttonText}>View All Users</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.bmiButton]}>
                    <Text style={styles.buttonText}>BMI Calculation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.calculatorButton]}>
                    <Text style={styles.buttonText}>Basic Calculator</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.dbStorageButton]}>
                    <Text style={styles.buttonText}>DB Storage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.showUsersButton]}>
                    <Text style={styles.buttonText}>Show All Users</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        flex: 1,
        height: 100,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,  // for Android shadow
    },
    addUserButton: {
        backgroundColor: '#0B3B17',
    },
    viewAllUsersButton: {
        backgroundColor: '#DF01D7',
    },
    bmiButton: {
        backgroundColor: '#FF6F61',
    },
    calculatorButton: {
        backgroundColor: '#4A90E2',
    },
    dbStorageButton: {
        backgroundColor: '#50C878',
    },
    showUsersButton: {
        backgroundColor: '#FFB74D',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default HomeScreen;
