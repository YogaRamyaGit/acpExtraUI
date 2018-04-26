import * as React from 'react';
import * as _ from 'lodash';
import { render } from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import App from './app/app';
import routes from './routes';
import * as userActions from './user/userActions';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

const store = configureStore();
const history = createHistory();
const appRoutes = _.values(routes).map(route => <Route path={route.path} exact={true} component={route.component} key={route.id} />);
store.dispatch(userActions.fetchUser());

const root: HTMLDivElement = document.createElement('div');
root.id = 'app';
document.body.appendChild(root);

render(
    <Provider store={store}>
        <Router history={history}>
            <App>
                {...appRoutes}
            </App>
        </ Router>
    </ Provider>,
    document.getElementById('app')
);
