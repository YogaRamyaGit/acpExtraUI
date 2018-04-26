import * as types from './allTableActionTypes';
import axios from 'axios';
import * as _ from 'lodash';

import { loaderActions, errorCodeActions } from '../common';

const fetchTablesSuccess = (tables: string[]) => {
    return { type: types.FETCH_ALL_TABLES_SUCCESS, tables };
};

export const fetchAllTables = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/tables')
            .then((response) => {
                const { tables } = response.data;
                const tableNames = _.map(tables, (table: any) => {
                    return table.name.replace('.sql', '').toLowerCase();
                });
                dispatch(fetchTablesSuccess(tableNames));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};
