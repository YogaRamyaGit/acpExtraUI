import { IConfig } from '../../configs/config';

export const setLayoutConfiguration = (editableConfig: IConfig, layoutType: string, delimiter: string, layoutConfig: any) => {
    editableConfig.layoutType = layoutType;
    editableConfig.delimiter = delimiter;
    editableConfig.layoutConfiguration = layoutConfig;
};
