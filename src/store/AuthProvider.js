import React, {Component} from "react";
import axios from './../helpers/axios';
import jwt_decode from 'jwt-decode';

const MyContext = React.createContext();

export const AuthConsumer = MyContext.Consumer;
export class AuthProvider extends Component {
    state = {
        token: null,
        user: null,
        registration_error: null,
        login_error: null,
        registered_email: null,
        loading: false,
        authRedirectPath: '/'
    };

    render() {
        return (
            <MyContext.Provider value={{
                state: this.state,
                setAuthRedirectPath: this.setAuthRedirectPath,
                authLogout: this.authLogout,
                authCheckState: this.authCheckState,
                auth: this.auth,
                register: this.register,
                registerCleanup: this.registerCleanup
            }}>
                {this.props.children}
            </MyContext.Provider>
        )
    }

    setAuthRedirectPath = (path) => {
        this.setState({
            authRedirectPath: path
        });
    };

    authLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('user');

        this.setState({
            token: null,
            user: null
        });
    };

    authCheckState = () => {
        // return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            this.authLogout();
            return;
        }

        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            this.authLogout();
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));

        this.setState({
            token: token,
            user: user
        });
    };

    auth = (email, password) => {
        this.setState({
            loading: true,
            login_error: null
        });

        let data = {
            "username": email,
            "password": password
        };

        axios.post("/login_check", data)
            .then(response => {
                const decoded = jwt_decode(response.data.token);
                let user = {
                    id: decoded.user_id,
                    email: decoded.username
                };
                const expirationDate = new Date(decoded.exp*1000);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate.toISOString());
                localStorage.setItem('user', JSON.stringify(user));

                this.setState({
                    token: response.data.token,
                    user: user,
                    loading: false,
                    login_error: null
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    login_error: err.response.data.errorMessage
                });
            });
    };

    register = (data) => {
        this.setState({
            loading: true,
            registration_error: null,
            registered_email: null
        });

        data = {
            "email": data.email,
            "name": data.name,
            "companyName": data.companyName,
            "password": data.password,
            "addresses": [
                {
                    "street": data.billingAddress,
                    "city": data.billingCity,
                    "postalCode": data.billingPostalCode,
                    "countryCode": data.billingCountry
                }
            ]
        };

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        };

        axios.post("/users", data, config)
            .then(response => {
                this.setState({
                    loading: false,
                    registration_error: null,
                    registered_email: response.data.email
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    registration_error: err.response.data.errorMessage,
                    registered_email: null
                });
            });
    };

    registerCleanup = (email) => {
        localStorage.setItem('lastRegisteredEmail', email);

        this.setState({
            loading: false,
            registered_email: null,
            registration_error: null
        });
    };
}
