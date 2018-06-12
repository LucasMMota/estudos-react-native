import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends Component {
    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
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
                <Image source={{ uri: deal.media[0] }} style={styles.image} />
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
        color: '#000',
        marginLeft: 10,
        backgroundColor: '#d6d7da',
        borderColor: '#d6d7da',
        width: 50,
        justifyContent: 'center',
        paddingLeft: 7
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