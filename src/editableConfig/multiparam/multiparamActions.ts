import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

export const updateMultiparam = (config: IConfig, params: any, index: number) => {
    config.setFilter('multiparam', index, params);
};
