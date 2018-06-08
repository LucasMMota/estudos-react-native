import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import {priceDisplay} from '../util'
class DealItem extends Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
    };

    render() {
        const { deal } = this.props;
        return (
            <View>
                <Image source={{ uri: this.props.deal.media[0] }}
                    style={styles.image}
                />
                <View>
                    <Text>{deal.title}</Text>
                    <Text>{priceDisplay(deal.price)}</Text>
                    <Text>{deal.cause.name}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 150
    }
})

export default DealItem;