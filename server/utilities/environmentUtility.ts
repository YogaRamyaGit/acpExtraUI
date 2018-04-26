/**
 * Created by ashutosh.dube on 4/19/18.
 */
import * as node_ec2_metadata from 'node-ec2-metadata';
import * as aws from 'aws-sdk';


export class EnvironmentUtility {
    public env: string;
    constructor() {
        /* Check if current machine is a EC2 instance */
        node_ec2_metadata.isEC2((onEC2) => {
            if (onEC2) {
                /* If machine is an EC2 instance, get the instance id */
                node_ec2_metadata.getMetadataForInstance('instance-id').
                then((instanceId) => {
                    const shared_credentials = new aws.SharedIniFileCredentials({profile: 'prod'});
                    const ec2 = new aws.EC2({credentials : shared_credentials, 'region' : 'us-east-1'});
                    const params = {
                        Filters: [
                            {
                                Name: "resource-id",
                                Values: [
                                    instanceId
                                ]
                            }
                        ]
                    };
                    /* Get EC2 instance tags */
                    ec2.describeTags(params, (err, data) => {
                        if (err) throw err;
                        const tags = data["Tags"];
                        let tag;
                        for (tag in tags) {
                            if (tag["Key"] === "env") {
                                /* Assing tag env's value to the variable */
                                this.env = tag["value"];
                            }
                        }
                    });
                });
            }
            else {
                this.env = "local";
            }
        });
    }
}
