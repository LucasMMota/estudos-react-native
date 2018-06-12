import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    PanResponder,
    Animated,
    Dimensions,
    Linking
} from 'react-native';

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
            this.width = Dimensions.get('window').width;
            if (Math.abs(gestureState.dx) > this.width * 0.3) {
                // get move direction
                const direction = Math.sign(gestureState.dx);

                Animated.timing(this.imageXPos, {
                    toValue: direction * this.width,
                    duration: 250,
                }).start(() => { this.handleSwipe(-1 * direction) });
            } else {
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                }).start();
            }
        },
    })

    handleSwipe = (indexDirection) => {
        // ultima imagem da lista
        if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            // volta a posicao da imagem para a pos inicial
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();

            return;
        }

        this.setState((prevState) => ({
            //muda o index para a nova imagem
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            // Next Image Animation
            this.imageXPos.setValue(indexDirection * this.width);
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
        });
    };

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

    openDealURL = () => {
        Linking.openURL(this.state.deal.url)
    }

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
                <ScrollView style={styles.detail}>
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
                    <Button title={"Buy this deal!"} onPress={this.openDealURL} />
                </ScrollView>
            </View>
        );
    }
}
// add remaining styles
const styles = StyleSheet.create({
    deal:{
        marginBottom: 20,
    },
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