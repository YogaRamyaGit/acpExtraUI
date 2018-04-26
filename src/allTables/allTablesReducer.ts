import * as types from './allTableActionTypes';
import initialState from '../reducers/initialState';

const allTablesReducer = (state = initialState.allTables, action) => {
    switch (action.type) {
        case types.FETCH_ALL_TABLES_SUCCESS:
            return action.tables;

        default:
            return state;
    }
};

export default allTablesReducer;
