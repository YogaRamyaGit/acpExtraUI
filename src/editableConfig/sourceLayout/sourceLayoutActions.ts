import { IConfig } from '../../configs/config';
import * as _ from 'lodash';

export const updateSourceLayout = (config: IConfig, sourceLayout: any[]) => {
    const { name, sha } = config.sourceLayout;
    config.sourceLayout = { name, sha, content: sourceLayout };
};
