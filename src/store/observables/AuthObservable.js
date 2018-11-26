import { action, computed, observable, runInAction } from 'mobx';
import axios from './../../helpers/axios';
import jwt_decode from 'jwt-decode';

// Note that we have deliberately avoided the use of arrow-functions to define the action.
// This is because arrow-functions capture the lexical this at the time the action is defined.
// However, the observable() API returns a new object, which is of course different from the lexical this that is captured in the action() call.
// This means, the this that you are mutating would not be the object that is returned from observable().

export const authState = observable({
    token: null,
    user: null,
    registration_error: null,
    login_error: null,
    registered_email: null,
    loading: false,
    authRedirectPath: '/',

    setAuthRedirectPath: action(function(path) {
        this.authRedirectPath = path;
    }),

    authLogout: action(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('user');

        this.token = null;
        this.user = null;
    }),

    authCheckState: action(function() {
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

        this.token = token;
        this.user = user;
    }),

    auth: action(function(email, password) {

        this.loading = true;
        this.login_error = null;

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

                runInAction(() => {
                    this.token = response.data.token;
                    this.user = user;
                    this.loading = false;
                    this.login_error = null;
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.loading = false;
                    this.login_error = err.response.data.errorMessage;
                });
            });
    }),

    register: action(function(data) {

        this.loading = true;
        this.registration_error = null;
        this.registered_email = null;

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
                runInAction(() => {
                    this.loading = false;
                    this.registration_error = null;
                    this.registered_email = response.data.email;
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.loading = false;
                    this.registration_error = err.response.data.errorMessage;
                    this.registered_email = null;
                });
            });
    }),

    registerCleanup: action(function(email) {
        localStorage.setItem('lastRegisteredEmail', email);

        this.loading = false;
        this.registration_error = null;
        this.registered_email = null;
    }),


});

