import React from 'react';
import { Animated, View, Text, StyleSheet, Easing, Dimensions } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {
    titleXPos = new Animated.Value(0)

    state = {
        deals: [],
        dealsFormSearch: [],
        currentDealId: null,
    };

    animateTitle = (direction = 1) => {
        const width = Dimensions.get('window').width - 150;

        // animated text while loading
        Animated.timing(
            this.titleXPos,
            {
                toValue: direction * width / 2,
                duration: 1000,
                easing: Easing.ease,
            }).start(({ finished }) => { // recebe um objeto que chamei de finished
                // se vier um objeto/sucesse na animacao anterior, chama novamente
                if (finished) {
                    this.animateTitle(-1 * direction)
                }
            });
    }

    async componentDidMount() {
        this.animateTitle();
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

        if (dealToDisplay.length > 0) {
            return (
                <View style={styles.main}>
                    <SearchBar searchDeals={this.searchDeals} />
                    <DealList deals={dealToDisplay} onItemPress={this.setCurrentDeal} />
                </View>
            );
        }

        return (
            <Animated.View style={[styles.container, { left: this.titleXPos }]}>
                < Text style={styles.header}>Beaksale</Text>
            </Animated.View>
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