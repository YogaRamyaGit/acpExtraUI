import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

export const updatePivotConfigs = (config: IConfig, pivotConfigs: any[]) => {
    // remove empty pivots
    pivotConfigs = _.filter(pivotConfigs, pivot => pivot.table_name);

    _.forEach(pivotConfigs, pivot => {
        // remove empty pivot sections
        let field_mapping = _.filter(pivot.field_mapping, (mapping) => {
            return _.compact(_.keys(mapping)).length > 0;
        });

        // remove empty mapping row
        field_mapping = _.map(field_mapping, mapping => {
            return _.omit(mapping, '');
        });

        pivot.field_mapping = field_mapping;
    });
    config.pivotConfigs = pivotConfigs;
};
