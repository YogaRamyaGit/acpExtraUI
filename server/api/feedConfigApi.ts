import * as _ from 'lodash';
import * as sql from 'sql.js';

import Store from './store';
import config from './storeConfig';

const replaceAll = (str: string, target: string, replacement: string) => {
    return str.split(target).join(replacement);
};

const getTableColumns = async (tableName, accessToken) => {
    const tablesMap = { 'person_affiliation': 'PRS_AFFL', 'person_org_affl': 'PRS_ORG_AFFL' };
    return Store.instance.getTableColumns(accessToken, tablesMap[tableName] || tableName)
        .then((result) => {
            let content = Buffer.from(result.content, 'base64').toString();
            // find the table name from regexp
            let table = content.match(/DROP\sTABLE\sIF\sEXISTS\s(.*)?(?=;)/)[1];
            if (_.includes(table, '.')) {
                // remove dots from the table name
                const newName = _.last(table.split('.'));
                // replace all occurances
                content = replaceAll(content, table, newName);
                table = newName;
            }
            // create new db every time, to avoid problem with duplicate indexes. To-Do: remove it. bad performance
            const db = new sql.Database();

            // get columns from sql string
            db.run(content);
            const res = db.exec(`PRAGMA table_info(${table})`);
            db.close();
            return res[0].values;
        }).catch(error => {
            console.log(`Failed to get info about ${tableName}`, error);
            return [];
        });
};

const parseContent = (content) => {
    let contentString = Buffer.from(content, 'base64').toString();
    const regex = /\,(?=\s*?[\}\]])/g;
    contentString = contentString.replace(regex, '');
    return JSON.parse(contentString);
};

export default {
    getAllTables: (req, res) => {
        const { accessToken } = req.session;

        Store.instance.getAllTables(accessToken)
            .then(tables => {
                return res.json({ tables });
            })
            .catch((error) => {
                console.log('Error: ', error);
                res.status(500).send('failed to fetch all tables');
            });
    },
    getTargetTables: (req, res) => {
        const { feedType, branch } = req.query;
        const filePath = `${config.feedConfigPath}/${feedType.toUpperCase()}.cfg`;
        const { accessToken } = req.session;

        Store.instance.getContent(accessToken, filePath, branch)
            .then((result: any) => {

                const content: any = parseContent(result.content);
                const targetTables = _.map(content.tables, (table: any) => table.table_name);

                res.json({ targetTables });
            })
            .catch((error) => {
                console.log('Error: ', error);
                if (error.request.statusCode === 404) {
                    return res.json({ targetTables: [] });
                }
                res.status(500).send('failed to fetch target tables');
            });
    },
    getTargetColumns: (req, res) => {
        const { feedType, branch, targetTables } = req.query;
        const filePath = `${config.feedConfigPath}/${feedType.toUpperCase()}.cfg`;
        const targetColumns = {};
        const { accessToken } = req.session;

        if (!targetTables || (targetTables.length <= 0)) {
            Store.instance.getContent(accessToken, filePath, branch)
                .then((result: any) => {

                    const content: any = parseContent(result.content);
                    const calls = _.reduce(content.tables, (acc, table) => {
                        acc.push(getTableColumns(table.table_name, accessToken).then((columns) => {
                            targetColumns[table.table_name] = _.map(columns, column => {
                                return { name: column[1], type: column[2], notNull: column[3] === 1, defaultValue: column[4], pk: column[5] === 1 };
                            });
                        }));
                        return acc;
                    }, []);

                    Promise.all(calls).then(() => {
                        res.json(targetColumns);
                    });
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    res.status(500).send('failed to fetch config');
                });
        } else {
            const calls = _.reduce(targetTables, (acc, table) => {
                acc.push(getTableColumns(table, accessToken).then((columns) => {
                    targetColumns[table] = _.map(columns, column => {
                        return { name: column[1], type: column[2], notNull: column[3] === 1, defaultValue: column[4], pk: column[5] === 1 };
                    });
                }));
                return acc;
            }, []);

            Promise.all(calls).then(() => {
                res.json(targetColumns);
            });
        }

    }
};
