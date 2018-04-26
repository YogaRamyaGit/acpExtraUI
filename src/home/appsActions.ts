import * as ActionTypes from './appsActionTypes';
import { find } from 'lodash';
import apps, { IApp } from './apps';

export const setCurrentApp = (app) => {
    if (typeof (app) === 'string') {
        app = find(apps, { id: app }) || {};
    }
    return { type: ActionTypes.SET_CURRENT_APP, app };
};
