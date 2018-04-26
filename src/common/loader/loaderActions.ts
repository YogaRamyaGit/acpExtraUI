import * as types from './loaderActionTypes';

export const startLoader = () => {
    return { type: types.START_LOADER };
};

export const stopLoader = () => {
    return { type: types.STOP_LOADER };
};

const loaderActions = { startLoader, stopLoader };

export default loaderActions;
