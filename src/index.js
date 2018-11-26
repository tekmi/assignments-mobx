import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {authState} from "./store/observables/AuthObservable";
import {userState} from "./store/observables/UserObservable";
import {themeState} from "./store/observables/ThemeObservable";

import {Provider} from 'mobx-react';
import {intercept} from 'mobx';
import App from './App';

intercept(themeState, 'theme', change => {
    if (!change.newValue) {
        return null;
    }

    if (!themeState.allowedThemes().includes(change.newValue)) {
        change.newValue = 'default';
    }

    return change;
});

const app = (
    <Provider authState={authState} userState={userState} themeState={themeState}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
