import { IConfig } from '../../configs/config';

export const updateTargetTables = (config: IConfig, targetTables: string[]) => {
    config.targetTables = targetTables;
};
