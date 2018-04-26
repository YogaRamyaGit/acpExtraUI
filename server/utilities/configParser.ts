import * as fs from 'fs';
import * as kmsUtility from './kmsUtility';
import {KmsUtiity} from "./kmsUtility";
import * as EnvUtil from './environmentUtility';


export class ConfigParser {
    private configurations: any;
    private kmsUtil: KmsUtiity;
    private env: string;

    constructor(configPath: string) {
         this.env = new EnvUtil.EnvironmentUtility().env;
         this.configurations  = JSON.parse(fs.readFileSync(configPath, 'utf8'));
         this.kmsUtil = new kmsUtility.KmsUtiity();

    }

    public getConfigurationsByKey(keyName: string, callback: any) {

        try {
            const keyConfig: JSON = this.configurations[keyName];
            if (keyConfig.hasOwnProperty("password") && this.env in ['prod', 'test']) {
                this.kmsUtil.decrypt(keyConfig["password"], (err, data) => {
                    console.log(data);
                    keyConfig["password"] = data;
                    callback(err, keyConfig);
                });
            } else {
                callback(null, keyConfig);
            }
        } catch (err) {
            console.log("error while fetching configurations for key : " + keyName);
            throw new Error("Bad Key error");
        }
    }
}
