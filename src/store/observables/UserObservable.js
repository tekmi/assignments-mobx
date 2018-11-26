import {action, observable, runInAction} from 'mobx';
import axios from './../../helpers/axios';
import {authState} from './AuthObservable';

// Note that we have deliberately avoided the use of arrow-functions to define the action.
// This is because arrow-functions capture the lexical this at the time the action is defined.
// However, the observable() API returns a new object, which is of course different from the lexical this that is captured in the action() call.
// This means, the this that you are mutating would not be the object that is returned from observable().

export const userState = observable({
    loading: false,
    user_details: null,

    get userDetails() {
        return this.user_details;
    },

    // TODO: called directly from User component...problems were with componentWillReceiveProps
    userGet: action(function (token, userId) {
        this.loading = true;

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get(`/users/${userId}`, config)
            .then(response => {
                let userDetails = {
                    id: response.data.id,
                    name: response.data.name,
                    companyName: response.data.companyName,
                    billingAddress: response.data.addresses[0].street,
                    billingCity: response.data.addresses[0].city,
                    billingPostalCode: response.data.addresses[0].postalCode,
                    billingCountry: response.data.addresses[0].countryCode,
                    billingAddressUri: response.data.addresses[0]['@id']
                };

                runInAction(() => {
                    this.loading = false;
                    this.user_details = userDetails;
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.loading = false;
                    this.user_details = null;
                });
            });
    }),

    userUpdate: action(function (token, userId, userDetails) {
        this.loading = true;

        let data = {
            "name": userDetails.name,
            "companyName": userDetails.companyName,
            "addresses": [
                {
                    "@id": userDetails.billingAddressUri,
                    "street": userDetails.billingAddress,
                    "city": userDetails.billingCity,
                    "postalCode": userDetails.billingPostalCode,
                    "countryCode": userDetails.billingCountry
                }
            ]
        };

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${token}`
            }
        };

        axios.put(`/users/${userId}`, data, config)
            .then(response => {
                let userDetails = {
                    id: response.data.id,
                    name: response.data.name,
                    companyName: response.data.companyName,
                    billingAddress: response.data.addresses[0].street,
                    billingCity: response.data.addresses[0].city,
                    billingPostalCode: response.data.addresses[0].postalCode,
                    billingCountry: response.data.addresses[0].countryCode,
                    billingAddressUri: response.data.addresses[0]['@id']
                };

                runInAction(() => {
                    this.loading = false;
                    this.user_details = userDetails;
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.loading = false;
                    this.user_details = null;
                });
            });
    }),

    userDelete: action(function(token, userId) {
        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${token}`
            }
        };


        axios.delete(`/users/${userId}`, config)
            .then(response => {
                authState.authLogout();
            })
            .catch(err => {
            });
    }),


});

