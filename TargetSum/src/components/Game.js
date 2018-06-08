import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import { View, Text, StyleSheet } from 'react-native';

class Game extends Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
    }

    state = {
        selectedIds: [],
    }

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(
            () => 1 + Math.floor(10 * Math.random()),
    );

    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0)
    // TODO: shuffle random numbers

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    }

    selectNumber = (numberIndex) => {
        this.setState(
            (prevState) => ({
                selectedIds: [...prevState.selectedIds, numberIndex]
            })
        );
    }

    // gameStatus: PALYING, WON, LOST
    gameStatus = () => {
        const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
            return acc + this.randomNumbers[curr];
        }, 0);
        // console.warn(sumSelected);

        if (sumSelected === this.target) {
            return 'WON';
        }

        if (sumSelected > this.target) {
            return 'LOST';
        }

        return 'PLAYING';

    }

    render() {
        const gameStatus = this.gameStatus();
        return (
            <View style={styles.container}>
                <Text style={styles.target}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {this.randomNumbers.map((randomNumber, index) =>
                        <RandomNumber
                            key={index}
                            id={index}
                            number={randomNumber}
                            isDisabled={this.isNumberSelected(index)}
                            onPress={this.selectNumber}
                        />
                    )}
                </View>
                <Text>{gameStatus}</Text>
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