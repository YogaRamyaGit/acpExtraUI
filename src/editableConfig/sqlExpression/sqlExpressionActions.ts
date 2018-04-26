import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

export const updateSqlExpressions = (config: IConfig, expressions: any[], index: number) => {
    // remove empty expressions
    expressions = _.filter(expressions, expression => expression.targetfieldname);
    config.setFilter('sql_expression', index, expressions);
};
