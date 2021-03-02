import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

import { AuthProvider } from '../authContext';
import AuthCodeRequest from './AuthCodeRequest';
import * as actions from './Store/action';


class Auth extends Component {

    state = {
        authenticated: false,
        user: null,
        refreshToken: ''
    };

    componentDidMount() {
        if (!window.location.pathname.includes("/verification")) {
            const cookies = new Cookies();
            const refresh_token = cookies.get('refresh_token');
            if (refresh_token && refresh_token !== undefined) {
                cookies.remove("code_verifier");
                this.setState({
                    authenticated: true,
                    refreshToken: refresh_token
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.authenticated !== this.state.authenticated) {
            if (this.state.authenticated) {
                this.props.onGetUserInfo();
            }
            else {
                this.initiateLogin();
            }
        }

        if (this.props.getUserInfoState !== prevProps.getUserInfoState) {
            if (this.props.getUserInfoState === 'SUCCESS') {
                this.setState({
                    user: this.props.user
                })
            }
            else if (this.props.getUserInfoState === 'ERROR') {
                this.logout();
            }
        }

        if (this.props.logoutState !== prevProps.logoutState) {
            if (this.props.logoutState === 'SUCCESS') {
                const cookies = new Cookies();
                cookies.remove("access_token");
                cookies.remove("refresh_token");
                this.setState({
                    authenticated: false
                })
            }
        }
    }

    initiateLogin = () => {
        if (!window.location.pathname.includes("/verification")) {
            AuthCodeRequest();
        }
    };

    logout = () => {
        this.props.onLogout();
    };

    clearSession = () => {
        const cookies = new Cookies();
        cookies.remove("access_token");
        cookies.remove("refresh_token");
        window.location.reload();
    }

    render() {

        const authProviderValue = {
            ...this.state,
            initiateLogin: this.initiateLogin,
            handleAuthentication: this.handleAuthentication,
            logout: this.logout,
            clearSession: this.clearSession
        };

        return (
            <AuthProvider value={authProviderValue}>
                {this.props.children}
            </AuthProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        getUserInfoState: state.auth.getUserInfoState,
        logoutState: state.auth.logoutState,
        user: state.auth.user,
        error: state.auth.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUserInfo: () => dispatch(actions.getUserInfo()),
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);