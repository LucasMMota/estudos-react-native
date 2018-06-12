import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {
    state = {
        deals: [],
        dealsFormSearch: [],
        currentDealId: null,
    };

    async componentDidMount() {
        const deals = await ajax.fetchInitialDeals();
        this.setState({ deals });
    }

    searchDeals = async (searchTerm) => {
        let dealsFormSearch = [];
        if (searchTerm) {
            dealsFormSearch = await ajax.fetchDealsSearchResult(searchTerm);
        }

        this.setState({ dealsFormSearch })
    }

    setCurrentDeal = (dealId) => {
        this.setState({ currentDealId: dealId });
    };

    unsetCurrentDeal = () => {
        this.setState({ currentDealId: null });
    };

    currentDeal = () => this.state.deals.find((deal) => deal.key === this.state.currentDealId);

    render() {
        if (this.state.currentDealId) {
            return (
                <View style={styles.main}>
                    <DealDetail
                        initialDealData={this.currentDeal()}
                        onBack={this.unsetCurrentDeal}
                    />
                </View>
            )
        }

        const dealToDisplay = this.state.dealsFormSearch.length > 0 ?
            this.state.dealsFormSearch
            : this.state.deals;
console.log(dealToDisplay)
        if (dealToDisplay.length > 0) {
            return (
                <View style={styles.main}>
                    <SearchBar searchDeals={this.searchDeals} />
                    <DealList deals={dealToDisplay} onItemPress={this.setCurrentDeal} />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                < Text style={styles.header}>Beaksale</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        marginTop: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 40,
    },
})

export default App;