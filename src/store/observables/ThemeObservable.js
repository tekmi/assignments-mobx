import {action, computed, decorate, observable} from 'mobx';

class ThemeObservable {
    constructor() {
        this.theme = 'default';
    }

    get getThemeName() {
        return this.theme.toUpperCase();
    }

    changeTheme(theme) {
        this.theme = theme;
    }

    allowedThemes() {
        return ['default', 'my-theme'];
    }
}

decorate(ThemeObservable, {
    theme: observable,
    getThemeName: computed,
    changeTheme: action,
});


export const themeState = new ThemeObservable();
