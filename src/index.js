import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider, AuthConsumer} from './store/AuthProvider';
import {UserProvider, UserConsumer} from './store/UserProvider';

import App from './App';

const app = (
    <AuthProvider>
        <UserProvider>
            <BrowserRouter>
                <AuthConsumer>
                    { authContext => (
                            <UserConsumer>
                                { userContext => (
                                        <App authContext={authContext} userContext={userContext}/>
                                    )
                                }
                            </UserConsumer>
                        )
                    }
                </AuthConsumer>
            </BrowserRouter>
        </UserProvider>
    </AuthProvider>
);

ReactDOM.render(app, document.getElementById('root'));
