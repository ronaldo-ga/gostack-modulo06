import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../../services/api'

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author } from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    }

    state = {
        stars: {},
        page: 1,
        loading: false,
        refreshing: false,
    }

    async componentDidMount() {
        this.load()
    }

    load = async (page=1) => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({
            loading: true,
        });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
            }
        });

        this.setState({
            stars: page >= 2 ? [...this.state.stars, ...response.data] : response.data,
            loading: false
        });

    }

    loadMore = async () => {
        const { page } = this.state;

        const nextPage = page + 1;

        this.load(nextPage)
    }

    refreshList = () => {
        this.setState({
            refreshing: true
        })

        this.load(1);

        this.setState({
            refreshing: false,
        })
    }

    renderWebView = repo => {
        const { navigation } = this.props;

        navigation.navigate('Repository', { repo });
    }

    render(){
        const { navigation } = this.props;
        const { stars, loading } = this.state;

        const user = navigation.getParam('user');

        return (
            <Container>
                {loading ? <ActivityIndicator color="#000" size="large"/> :
                <>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>

                <Stars
                    onEndReachedThreshold={0.2}
                    onEndReached={this.loadMore}
                    onRefresh={this.refreshList}
                    refreshing={this.state.refreshing}
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred>
                            <TouchableOpacity onPress={() => this.renderWebView(item.owner.login+'/'+item.name)}>
                                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </TouchableOpacity>
                        </Starred>
                    )}
                />
                </>
                    }
            </Container>
          );
    }
}
