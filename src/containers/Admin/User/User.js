import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from './../../../App.css';
import {NavLink} from 'react-router-dom';
import {inject, observer} from "mobx-react";

const User = observer(class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: {value: '', error: '', touched: false},
            companyName: {value: '', error: '', touched: false},
            billingAddress: {value: '', error: '', touched: false},
            billingCity: {value: '', error: '', touched: false},
            billingPostalCode: {value: '', error: '', touched: false},
            billingCountry: {value: '', error: '', touched: false},
            billingAddressUri: '',
            isValid: false
        }
    }

    componentDidMount () {
        // TODO: directly changing MobX state and also below calling local state, while it could be achieved via props update via Mobx action...
        this.props.userState.loading = true;

        this.props.themeState.changeTheme('my-theme');

        let token = this.props.authState.token;
        let userId = this.props.authState.user.id;

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
                    name: {
                        ...this.state.name,
                        value: userDetails.name
                    },
                    companyName: {
                        ...this.state.companyName,
                        value: userDetails.companyName ? userDetails.companyName : ''
                    },
                    billingAddress: {
                        ...this.state.billingAddress,
                        value: userDetails.billingAddress
                    },
                    billingCity: {
                        ...this.state.billingCity,
                        value: userDetails.billingCity
                    },
                    billingPostalCode: {
                        ...this.state.billingPostalCode,
                        value: userDetails.billingPostalCode
                    },
                    billingCountry: {
                        ...this.state.billingCountry,
                        value: userDetails.billingCountry
                    },
                    billingAddressUri: userDetails.billingAddressUri
                });
            })
            .then(() => {
                this.props.userState.loading = false;
            });
    }

    // This worked with Redux, React Context and Unstated. With Mobx, such combination were not possible...looks like Mobx
    // is not fully honouring this lifecycle method. Or maybe some Mobx internal observable methods happen before or after this React lifecycle event...

    // componentWillReceiveProps(nextProps) {
    //     console.log('componentWillReceiveProps', nextProps.userState.myUserDetails);
    //     if (nextProps.userState.myUserDetails) {
    //         this.setState({
    //             name: {
    //                 ...this.state.name,
    //                 value: nextProps.userState.user_details.name
    //             },
    //             companyName: {
    //                 ...this.state.companyName,
    //                 value: nextProps.userState.user_details.companyName ? nextProps.userState.user_details.companyName : ''
    //             },
    //             billingAddress: {
    //                 ...this.state.billingAddress,
    //                 value: nextProps.userState.myUserDetails.billingAddress
    //             },
    //             billingCity: {
    //                 ...this.state.billingCity,
    //                 value: nextProps.userState.user_details.billingCity
    //             },
    //             billingPostalCode: {
    //                 ...this.state.billingPostalCode,
    //                 value: nextProps.userState.user_details.billingPostalCode
    //             },
    //             billingCountry: {
    //                 ...this.state.billingCountry,
    //                 value: nextProps.userState.user_details.billingCountry
    //             },
    //             billingAddressUri: nextProps.userState.user_details.billingAddressUri
    //         });
    //     }
    // }

    inputChangedHandler = (event) => {
        this.setState({
            [event.target.id]: {
                ...this.state[event.target.id],
                value: event.target.value,
                touched: true,
                error: event.target.checkValidity() === false ? event.target.validationMessage : ''
            },
            isValid: event.target.form.checkValidity()
        });
    };

    submitHandler = (event) => {
        event.preventDefault();

        if (event.target.checkValidity() === false) {
            return;
        }

        let userDetails = Object.keys(this.state).reduce((result, key) => {
            if (typeof this.state[key] === 'object') {
                result[key] = this.state[key].value;
            }
            return result;
        }, {});

        userDetails['billingAddressUri'] = this.state.billingAddressUri;

        this.props.userState.userUpdate(
            this.props.authState.token,
            this.props.authState.user.id,
            userDetails
        );
    };

    render() {
        const {themeState} = this.props;

        let userDetails = <Spinner/>;
        if (!this.props.userState.loading) {
            userDetails = (
                <div className={`container text-left ${themeState.theme}`}>
                    <form method="post" noValidate onSubmit={(event) => this.submitHandler(event)}>
                        <div className='form-group'>
                            <label htmlFor="email">Email address</label>
                            <input disabled={true} type="email" name="email" className="form-control" id="email"
                                   aria-describedby="emailHelp" placeholder="Please enter email"
                                   value={this.props.authState.user.email}
                                   required="required"/>
                        </div>
                        <div className={this.state.name.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="name">Name</label>
                            <input type="name" name="name" className="form-control" id="name"
                                   aria-describedby="nameHelp" placeholder="Please enter name"
                                   onChange={(event) => this.inputChangedHandler(event)}
                                   onBlur={(event) => this.inputChangedHandler(event)}
                                   value={this.state.name.value}
                                   required="required"
                                   minLength="2" />
                            <div className="invalid-feedback">{this.state.name.error}</div>
                        </div>
                        <div className={this.state.companyName.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="companyName">Company Name</label>
                            <input type="companyName" name="companyName" className="form-control" id="companyName"
                                   aria-describedby="companyNameHelp" placeholder="Please enter company name"
                                   onChange={(event) => this.inputChangedHandler(event)}
                                   onBlur={(event) => this.inputChangedHandler(event)}
                                   value={this.state.companyName.value}
                                   minLength="2" />
                            <div className="invalid-feedback">{this.state.companyName.error}</div>
                        </div>
                        <div className={this.state.billingAddress.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="billingAddress">Billing Address</label>
                            <input type="text" className="form-control" name="billing_address" id="billingAddress"
                                   minLength="2"
                                   placeholder="Please enter street"
                                   onChange={(event) => this.inputChangedHandler(event)}
                                   onBlur={(event) => this.inputChangedHandler(event)}
                                   value={this.state.billingAddress.value}
                                   required="required"/>
                            <div className="invalid-feedback">{this.state.billingAddress.error}</div>
                        </div>
                        <div className={this.state.billingCity.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="billingCity">Billing City</label>
                            <input type="text" className="form-control" name="billing_city" id="billingCity"
                                   minLength="2"
                                   placeholder="Please enter city"
                                   onChange={(event) => this.inputChangedHandler(event)}
                                   onBlur={(event) => this.inputChangedHandler(event)}
                                   value={this.state.billingCity.value}
                                   required="required"/>
                            <div className="invalid-feedback">{this.state.billingCity.error}</div>
                        </div>
                        <div
                            className={this.state.billingPostalCode.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="billingPostalCode">Billing Postal Code</label>
                            <input type="text" className="form-control" name="billing_postal_code"
                                   id="billingPostalCode"
                                   placeholder="Please enter postal code"
                                   onChange={(event) => this.inputChangedHandler(event)}
                                   onBlur={(event) => this.inputChangedHandler(event)}
                                   value={this.state.billingPostalCode.value}
                                   required="required"
                                   pattern="[0-9A-Za-z\-_\s]{2,}"
                                   title="Alphanumeric chars, minimum 2"/>
                            <div className="invalid-feedback">{this.state.billingPostalCode.error}</div>
                        </div>
                        <div className={this.state.billingCountry.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="billingCountry">Billing Country</label>
                            <select className="form-control" id="billingCountry" name="billing_country"
                                    onChange={(event) => this.inputChangedHandler(event)}
                                    onBlur={(event) => this.inputChangedHandler(event)}
                                    value={this.state.billingCountry.value}
                                    required="required">
                                <option value="">Please choose country</option>
                                <option value="US">USA</option>
                                <option value="AU">Australia</option>
                                <option value="AT">Austria</option>
                                <option value="BE">Belgium</option>
                                <option value="BR">Brazil</option>
                                <option value="CA">Canada</option>
                                <option value="CN">China</option>
                                <option value="DK">Denmark</option>
                                <option value="FI">Finland</option>
                                <option value="FR">France</option>
                                <option value="IN">India</option>
                                <option value="IE">Ireland</option>
                                <option value="IT">Italy</option>
                                <option value="JP">Japan</option>
                                <option value="LU">Luxembourg</option>
                                <option value="NL">Netherlands</option>
                                <option value="NO">Norway</option>
                                <option value="PL">Poland</option>
                                <option value="PT">Portugal</option>
                                <option value="RO">Romania</option>
                                <option value="RU">Russian Federation</option>
                                <option value="SE">Sweden</option>
                                <option value="CH">Switzerland</option>
                                <option value="TR">Turkey</option>
                                <option value="UA">Ukraine</option>
                            </select>
                            <div className="invalid-feedback">{this.state.billingCountry.error}</div>
                        </div>
                        <div className={classes.FormNavButtons}>
                            <button type="submit" className="btn btn-success" disabled={!this.state.isValid}>Update</button>
                            <NavLink className="btn btn-danger" to="/user-delete">Delete my account</NavLink>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div>
                <Toolbar/>
                <h3 title={`Using ${themeState.getThemeName}`}>Editing user: <i>{this.props.authState.user.email}</i></h3>
                {userDetails}
            </div>
        );
    }
});

export default withErrorHandler(inject("authState", "userState", "themeState")(User), axios);
