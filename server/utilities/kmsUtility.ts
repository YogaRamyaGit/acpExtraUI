import * as aws from 'aws-sdk';
import * as EnvUtil from './environmentUtility';


export class KmsUtiity {
    private kms: aws.KMS;

    constructor() {
        const env = new EnvUtil.EnvironmentUtility().env;
        if (env === "local") {
            throw new Error("KMS for local mode not supported yet");
        } else {
            this.kms = new aws.KMS();
        }
    }

    public decrypt(value: string, callback: any) {

        const params = {
            CiphertextBlob :  Buffer.from(value, 'base64')
        };
        this.kms.decrypt(params, (err, data) => {
            if (err)
               console.log("error");
            const decrypted_value = data["Plaintext"];
            callback(err, decrypted_value);
        });
    }
}