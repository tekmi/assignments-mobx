import React, {Component} from "react";
import axios from './../helpers/axios';

const MyUserContext = React.createContext();

export const UserConsumer = MyUserContext.Consumer;
export class UserProvider extends Component {
    state = {
        loading: false,
        user_details: null
    };

    render() {
        return (
            <MyUserContext.Provider value={{
                state: this.state,
                userGet: this.userGet,
                userDelete: this.userDelete,
                userUpdate: this.userUpdate
            }}>
                {this.props.children}
            </MyUserContext.Provider>
        )
    }


    userGet = (token, userId) => {
        this.setState({
            loading: true
        });

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

                this.setState({
                    loading: false,
                    user_details: userDetails
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    user_details: null
                });
            });
    };

    userUpdate = (token, userId, userDetails) => {
        this.setState({
            loading: true
        });

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

                this.setState({
                    loading: false,
                    user_details: userDetails
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    user_details: null
                });
            });
    };

    userDelete = (token, userId, logoutFunc) => {
        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${token}`
            }
        };

        axios.delete(`/users/${userId}`, config)
            .then(response => {
                // BUU: Not possible to easy call other state containers like below
                // let authContainer = new AuthContainer();
                // authContainer.authLogout();

                logoutFunc();
            })
            .catch(err => {
            });
    };
}

