import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

export const updateDefaultValues = (config: IConfig, defaultValues: any, index: number) => {
    // remove empty default values
    defaultValues = _.reduce(defaultValues, (result, value, key) => {
        if (key) {
            result[key] = value;
        }
        return result;
    }, {});
    config.setFilter('default_value', index, defaultValues);
};
