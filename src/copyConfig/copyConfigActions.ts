import { IConfig } from '../configs/config';

export const updateConfig = (config: IConfig, dataPartner: string, feedType: string, subType: string, name: string) => {
    config.updateFeedInfo(dataPartner, feedType, subType);
    config.name = name;
};
