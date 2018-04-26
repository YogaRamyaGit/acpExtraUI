import { reduce } from 'lodash';
import { IConfig } from '../../configs/config';

export const updateBusinessRules = (config: IConfig, businessRules: any) => {
    // remove empty default values
    businessRules = reduce(businessRules, (result, value, key) => {
        if (key) {
            result[key] = value;
        }
        return result;
    }, {});
    config.businessRules = businessRules;
};
