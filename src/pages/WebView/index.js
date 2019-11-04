import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default function Repository({navigation}){
    const repo = navigation.getParam('repo');

    return (
        <WebView
            source={{ uri: `https://github.com/${repo}` }}
          />
      );
}

Repository.propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

Repository.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo'),
});
