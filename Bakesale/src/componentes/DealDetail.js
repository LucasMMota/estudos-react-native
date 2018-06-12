import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends Component {
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            // The most recent move distance is gestureState.move{X,Y}

            // The accumulated gesture distance since becoming responder is
            // gestureState.d{x,y}
            this.imageXPos.setValue(gestureState.dx);
        },
        onPanResponderRelease: (evt, gestureState) => {
            // The user has released all touches while this view is the
            // responder. This typically means a gesture has succeeded
            const width = Dimensions.get('window').width;
            if (Math.abs(gestureState.dx) > width * 0.4) {
                const direction = Math.sign(gestureState.dx);
                
                Animated.timing(this.imageXPos, {
                    toValue: direction * width,
                    duration: 250,
                }).start();
            }
        },
    })

    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealsDetail(this.state.deal.key);
        console.log(fullDeal);
        this.setState({ deal: fullDeal })
    };

    render() {
        const { deal } = this.state;
        return (
            <View style={styles.deal}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>
                <Animated.Image
                    {...this.imagePanResponder.panHandlers}
                    source={{ uri: deal.media[this.state.imageIndex] }}
                    style={[styles.image, { left: this.imageXPos }]} />
                <View style={styles.detail}>
                    <View>
                        <Text style={styles.title}>{deal.title}</Text>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.info}>
                            <Text style={styles.price}>{deal.cause.name}</Text>
                            <Text style={styles.cause}>{priceDisplay(deal.price)}</Text>
                        </View>
                    </View>
                    {deal.user && (
                        <View style={styles.user}>
                            <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                            <Text>{deal.user.name}</Text>
                        </View>
                    )}
                    <View style={styles.description}>
                        <Text>{deal.description}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
// add remaining styles
const styles = StyleSheet.create({
    backLink: {
        marginBottom: 5,
        color: '#22f',
        marginLeft: 10,
        // backgroundColor: '#d6d7da',
        // borderColor: '#d6d7da',
        // width: 50,
        // justifyContent: 'center',
        // paddingLeft: 7
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc'
    },
    detail: {
        borderColor: '#bbb',
        borderWidth: 1,
    },
    info: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237,149,45,0.4)',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15
    },
    cause: {
        flex: 2,
    },
    price: {
        flex: 1,
        textAlign: 'right'
    },
    avatar: {
        width: 60,
        height: 60,
    }
})

export default DealDetail;