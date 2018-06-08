import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';
import { View, Text, StyleSheet, Button } from 'react-native';

class Game extends Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
    }

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds, // pega o initialSeconds passado
    }

    gameStatus = 'PLAYING';

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(
            () => 1 + Math.floor(10 * Math.random()),
    );

    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0)
    shuffledRandomNumbers = shuffle(this.randomNumbers);

    //funcao chamada automaticamente pelo RN
    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState(
                (prevState) => {
                    return { remainingSeconds: prevState.remainingSeconds - 1 }; // a cada segundo diminui 1 do remainingSeconds
                },
                () => {
                    // depois de decrementar verifica se chegou em 0s e remove o intervalo.
                    if (this.state.remainingSeconds === 0) {
                        clearInterval(this.intervalId);
                    }
                });
        }, 1000);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0
        ) {
            this.gameStatus = this.calcGame(nextState);
            if (this.gameStatus !== 'PLAYING') {
                clearInterval(this.intervalId);
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

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
    calcGame = (nextState) => {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffledRandomNumbers[curr];
        }, 0);



        if (sumSelected === this.target) {
            return 'WON';
        }

        //se acabar o tempo ou a soma passar o valor target: perde
        if (nextState.remainingSeconds === 0 || sumSelected > this.target) {
            return 'LOST';
        }

        return 'PLAYING';

    }

    render() {
        const gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {this.shuffledRandomNumbers.map((randomNumber, index) =>
                        <RandomNumber
                            key={index}
                            id={index}
                            number={randomNumber}
                            isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
                            onPress={this.selectNumber}
                        />
                    )}
                </View>
                {this.gameStatus !== 'PLAYING' && (
                    <Button title={'Jogar novamente'} onPress={this.props.onPlayAgain} />
                )}
                <Text>Tempo restante: {this.state.remainingSeconds}</Text>
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

    STATUS_PLAYING: {
        backgroundColor: '#bbb',
    },
    STATUS_WON: {
        backgroundColor: 'green',
    },
    STATUS_LOST: {
        backgroundColor: 'red',
    }

});

export default Game;

//TODOs make the game harder, add score
