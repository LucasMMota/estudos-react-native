import React, { Component } from 'react';

import { TextInput, StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import debounce from 'lodash.debounce';

class SearchBar extends Component {

    static propTypes = {
        searchDeals: PropTypes.func.isRequired,
    };

    state = {
        searchTerm: '',
    };

    debounceSearchDeals = debounce(this.props.searchDeals, 300);

    handleChange = (searchTerm) => {
        this.setState({ searchTerm }, () => {
            this.debounceSearchDeals(this.state.searchTerm);
        })
    }

    searchDeals = (searchTerm) => {
        this.props.searchDeals(searchTerm);
        this.inputElement.blur()
    }

    render() {
        return (
            <TextInput
                ref={(inputElement) => { this.inputElement = inputElement }}
                placeholder={'Search All Deals'}
                style={styles.input}
                onChangeText={this.handleChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginHorizontal: 12
    }
})

export default SearchBar;