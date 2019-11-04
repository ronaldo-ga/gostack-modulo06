import React, { Component } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';3
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import api from '../../services/api';
import { Container, Form, Input, SubmitButton, List, User, Avatar, Name, Bio, ProfileButton, ProfileButtonText } from './styles'

import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Main extends Component {
    static navigationOptions = {
        title: 'Usuários'
    }

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        })
    }

    state = {
        newUser: '',
        users: [],
        loading: false
    }

    async componentDidMount() {
        const users = await AsyncStorage.getItem('users');

        if (users) {
            this.setState({users: JSON.parse(users)})
        }
    }

    async componentDidUpdate(_, prevState) {
        if (prevState.users !== this.state.users){
            await AsyncStorage.setItem('users', JSON.stringify(this.state.users));
        }
    }

    handleSubmit = async () => {
        const { newUser, users } = this.state;

        this.setState({
            loading: true
        });

        try{
            const response = await api.get(`/users/${newUser}`);

            const data = {
                name: response.data.name,
                login: response.data.login,
                bio: response.data.bio,
                avatar: response.data.avatar_url
            }

            this.setState({
                users: [...users, data],
                newUser: '',
                loading: false,
            });

            Keyboard.dismiss();
        } catch {
            showMessage({
                message: "Usuário não encontrado !",
                type: "danger",
                icon: "auto",
              });

            this.setState({
                newUser: '',
                loading: false,
            });
        }

    }

    handleNavigate = user => {
        const { navigation } = this.props;

        navigation.navigate('User', { user });
    }

    render(){
        const { users, newUser, loading } = this.state;

        return (
            <Container>
                <Form>
                    <Input
                        defaultValue={newUser}
                        autoCorrect={false}
                        autoCaptalize='none'
                        placeholder='Adicionar Usuário'
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleSubmit}
                    />
                    <SubmitButton loading={loading} onPress={this.handleSubmit} >
                        { loading ? <ActivityIndicator color='#fff' /> : <Icon name="add" size={20} color="#fff" />}
                    </SubmitButton>
                </Form>

                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }} />
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>

                            <ProfileButton onPress={() => this.handleNavigate(item)} >
                                <ProfileButtonText>Ver Perfil</ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />

                <FlashMessage position="top" />
            </Container>
          );
    }
}
