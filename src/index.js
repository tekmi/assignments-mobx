import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider, Subscribe} from 'unstated';
import AuthStateContainer from './store/AuthContainer';
import UserStateContainer from './store/UserContainer';

import App from './App';

const app = (
    <Provider>
        <BrowserRouter>
            {/*BUU: many times forced to subscribe to all of them, in order to pass it later by props*/}
            <Subscribe to={[AuthStateContainer, UserStateContainer]}>
                {
                    (authContainer, userContainer) => (
                        <App authStateContainer={authContainer} userStateContainer={userContainer}/>
                    )
                }
            </Subscribe>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
