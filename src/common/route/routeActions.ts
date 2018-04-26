import * as _ from 'lodash';
import * as types from './routeActionTypes';

import routes from '../../routes';

export const setRoute = (currentRoute, data = {}) => {
    if (_.isString(currentRoute)) {
        // ability to change route specifying name of the page
        currentRoute = _.assign({}, routes[currentRoute]); // set a copy. Avoid changing the original route
        if (_.values(data)) {
            currentRoute.data = data;
        }
    }
    return { type: types.CHANGE_ROUTE, currentRoute };
};

const routeActions = { setRoute };
export default routeActions;

