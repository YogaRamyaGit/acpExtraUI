import Store from './store';
import * as fs from 'fs';
import * as path from 'path';
import * as mysql from 'mysql';
import * as ConfigParser from '../utilities/configParser';
import * as constants from '../utilities/constants';

export default {
    createWorkflow: (req, res) => {
        const { content, branch } = req.body;
        const filePath = req.body.path;
        const { accessToken } = req.session;
        console.log('came to create workflow');
        console.log(`branch: ${branch}, filePath: ${filePath}`);
        Store.instance.createWorkflow(accessToken, branch, content, filePath).then((result) => {
            res.json(result);
        }).catch(error => {
            console.log('failed to create workflow', error);
            res.status(500).send(`failed to create workflow for ${filePath}`);
        });
    },
    updateWorkflow: (req, res) => {
        const { contents, sha, branch } = req.body;
        const filePath = req.body.path;
        const { accessToken } = req.session;

        try {
            Store.instance.updateWorkflow(
                accessToken,
                filePath,
                branch,
                contents,
                sha
            )
                .then((result: any) => { res.json(result.content); })
                .catch((error) => { res.status(500).send('Failed to update config'); });
        } catch (error) {
            res.status(500).send('Failed to update config');
        }
    },
    getWorkflow: (req, res) => {
        const { branch } = req.query;
        const filePath = req.query.path;
        const { accessToken } = req.session;

        Store.instance.getWorkflow(accessToken, branch, filePath).then((result) => {
            res.json(result);
        }).catch(error => {
            if (error.response && error.response.status === 404) {
                return res.json([]);
            }
            res.status(500).send(`failed to fetch workflow for ${filePath}`);
        });
    },
    getWorkflows: (req, res) => {
        const { sha } = req.query;
        const { accessToken } = req.session;

        if (!sha) {
            return res.status(500).send('require branch sha');
        }

        Store.instance.getWorkflows(accessToken, sha).then((result) => {
            res.json(result);
        }).catch(error => {
            console.log('workflow fetch error', error);
            if (error.response && error.response.status === 404) {
                return res.json([]);
            }
            res.status(500).send('failed to fetch workflows');
        });
    },
    getWorkFlowTemplate: (req, res) => {
        const { partner, feed, targetTables } = req.query;

        if (!(partner && feed)) {
            res.status(500).send("error getting partner and feed information");
        }

        let content: string = fs.readFileSync(path.join(__dirname, '../misc/workflow/workflow-template.sql'), "utf8");

        /* replace data partner and feed placeholders */
        content = content.replace(/<PARTNER>/g, partner.toUpperCase())

            .replace(/<FEED>/g, feed.toUpperCase())
            .replace(/<partner>/g, partner.toLowerCase())
            .replace(/<feed>/g, feed.toLowerCase());

        /* Get feed config information from github */

        /* <EDT_PROCESSED_BUCKET>/person/@person */

        const tables: string[] = targetTables || [];
        const uploadTableStrings: string[] = [];
        const arrLength = tables.length;
        for (let i = 0; i < arrLength; i++) {
            uploadTableStrings.push("<EDT_PROCESSED_BUCKET>/" + tables[i] + "/@" + tables[i]);
        }


        const tableString: string = uploadTableStrings.join(";");

        /* Replace table string */
        content = content.replace(/<TABLES>/g, tableString);
        res.json({ workflow_template: content });
    },

    putWorkFlowConfigurationsToDB : (req, res) => {

        /* get execution script from params */
        const script: string = req.body.script;

        try {
             /* get connection details */
            const parser = new ConfigParser.ConfigParser(constants.CONFIG_PATH);
            parser.getConfigurationsByKey(constants.ACP_WF_METADATA_CONFIG_KEY, (err, data: JSON) => {
                    if (err) throw err;
                    let conn;
                    if (data.hasOwnProperty("ssl_ca")) {
                        const ssl_ca = fs.readFileSync(data["ssl_ca"]);
                        conn  = mysql.createConnection({
                            host: data["host"],
                            user: data["user"],
                            password: data["password"],
                            multipleStatements: true,
                            ssl  : {
                                ca : ssl_ca
                            }
                        });
                    } else {
                        /* get database connection */
                        conn = mysql.createConnection({
                            host: data["host"],
                            user: data["user"],
                            password: data["password"],
                            multipleStatements: true
                        });
                    }

                    conn.connect((err) => {
                        if (err) {
                            throw err;
                        }
                        /* execute the script amd return status */
                        conn.query(script, (error, results, fields) => {
                            if (error) {
                                throw error;
                            }
                            res.json({
                                status: results
                            });
                        });
                    });
                }
            );

        } catch(error){
            res.status(500).send(error.message);
        }
    },
    executeWorkflow: (req, res) => {
        const {dataPartner, feedType} = req.body;

        if (! (dataPartner && feedType)){
            res.status(500).send('Failed to fetch dataPartner and Feed type');
        }
        try {
            Store.instance.executeWorkflow(dataPartner, feedType)
                .then((result: any) => { res.json(result); })
                .catch((error) => { res.status(500).send('Failed to execute workflow in cluster ', error.message); });

        } catch (error) {
            res.status(500).send('Failed to execute workflow in cluster ', error.message);
        }
    }
};
