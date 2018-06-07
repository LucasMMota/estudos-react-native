import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import { View, Text, StyleSheet } from 'react-native';

class Game extends Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
    }

    state = {
        selectedNumbers: [],
    }

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(() => 1 + Math.floor(10 * Math.random()));

    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0)
    // TODO: shuffle random numbers

    isNumberSelected = (numberIndex)=> {
        return this.state.selectedNumbers.indexOf(numberIndex)>=0;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.target}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {this.randomNumbers.map((randomNumber, index) =>
                        <RandomNumber key={index} number={randomNumber} isSelected={this.isNumberSelected(index)}/>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex: 1
    },

    target: {
        fontSize: 40,
        backgroundColor: '#aaa',
        marginHorizontal: 50,
        textAlign: 'center',
    },

    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },

});

export default Game;