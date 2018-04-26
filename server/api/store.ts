import * as _ from 'lodash';
import * as scp2 from 'scp2';
import * as winston from 'winston';
import * as node_ssh from 'node-ssh';

import config from './storeConfig';
import requestExecutor from './requestExecutor';
import { start } from 'repl';

interface IBranch {
    name: string;
    commit?: {
        sha: string;
        url: string;
    };
}

interface IFile {
    type: string;
    name: string;
    path: string;
    content?: string;
    sha: string;
    size: number;
    download_url?: string;
    git_url: string;
    html_url: string;
    url: string;
    _links: any;
}

interface IAccessToken {
    access_token: string;
    scope: string;
    token_type: string;
}

interface IUser {
    login: string;
    id: number;
    avatar_url: string;
}

export default class Store {
    private baseAPIUrl: string = 'https://api.github.com';
    private baseAuthUrl: string = 'https://github.com';
    private _baseBranch: IBranch;
    private static _instance: Store;
    private logger;

    constructor() {
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.File)({ filename: 'logs/cluster.log' })
            ]
        });
    }

    public static get instance(): Store {
        if (_.isNil(Store._instance)) {
            Store._instance = new Store();
        }
        return Store._instance;
    }

    public async getAccessToken(code: string): Promise<IAccessToken> {
        const { client_id, client_secret } = process.env;
        const params = { client_id, client_secret, code };
        const url = `${this.baseAuthUrl}/login/oauth/access_token`;
        const accessToken: any = await requestExecutor('post', url, params, null);
        return accessToken as IAccessToken;
    }
    public async getUserInfo(accessToken: string): Promise<IUser> {
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/user`;
        const user = await requestExecutor('get', url, params, null);
        return user as IUser;
    }
    public async getConfigBranches(accessToken: string): Promise<IBranch[]> {
        const { repoOwner, repoName } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/branches?per_page=1000`;
        const branches: IBranch[] = await requestExecutor('get', url, params, null);
        this._baseBranch = _.find(branches, { name: config.baseBranch });
        return branches as IBranch[];
    }
    public async getWorkflowBranches(accessToken: string): Promise<IBranch[]> {
        const { repoOwner, repoName } = config.workflowConfig;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/branches?per_page=1000`;
        const branches: IBranch[] = await requestExecutor('get', url, params, null);
        this._baseBranch = _.find(branches, { name: config.baseBranch });
        return branches as IBranch[];
    }
    public async createBranch(accessToken: string, branchName: string, sha: string): Promise<IBranch> {
        const { repoOwner, repoName } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/git/refs`;

        const data = {
            ref: `refs/heads/${branchName}`,
            sha
        };

        const result: any = await requestExecutor('post', url, params, data);
        return result;
    }
    public async createWorkflowBranch(accessToken: string, branchName: string, sha: string): Promise<IBranch> {
        const { repoOwner, repoName } = config.workflowConfig;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/git/refs`;

        const data = {
            ref: `refs/heads/${branchName}`,
            sha
        };

        const result: any = await requestExecutor('post', url, params, data);
        return result;
    }
    public async getConfigs(accessToken: string, branchName: string, perPage: number, page: number): Promise<IFile[]> {
        const { repoOwner, repoName, sourcePath } = config;
        const params = { access_token: accessToken, ref: branchName, page: page, per_page: perPage };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${sourcePath}`;
        const files = await requestExecutor('get', url, params, null);
        return files as IFile[];
    }
    public async getContent(accessToken: string, path: string, branchName: string): Promise<IFile> {
        const { repoOwner, repoName } = config;
        const params = { access_token: accessToken, ref: branchName };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const file = await requestExecutor('get', url, params, null);
        return file as IFile;
    }
    public async getTables(accessToken: string, fileName: string, branch: string): Promise<IFile> {
        const { repoOwner, repoName, sourcePath } = config;
        const params = { access_token: accessToken, ref: branch };
        const path = `${sourcePath}/${fileName}`;
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const file = await requestExecutor('get', url, params, null);
        return file as IFile;
    }
    public async updateConfig(accessToken: string, path: string, branchName: string, contents: string, sha: string): Promise<any> {
        if (branchName === config.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;

        const data = {
            "message": `Updated ${path}`,
            "content": contents,
            "sha": sha,
            "branch": branchName
        };

        const result: any = await requestExecutor('put', url, params, data);
        return result;
    }
    public async getSourceLayout(accessToken: string, fileName: string, branchName: string): Promise<IFile> {
        const { repoOwner, repoName } = config;
        const path = `${config.sourceLayoutPath}/${fileName}`;
        const params = { access_token: accessToken, ref: branchName };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const file = await requestExecutor('get', url, params, null);
        return file as IFile;
    }
    public async updateSourceLayout(accessToken: string, fileName: string, branchName: string, contents: string, sha: string): Promise<any> {
        if (branchName === config.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const path = `${config.sourceLayoutPath}/${fileName}`;
        const { repoOwner, repoName } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;

        const data = {
            "message": `Updated ${path}`,
            "content": contents,
            "sha": sha,
            "branch": branchName
        };

        const result: any = await requestExecutor('put', url, params, data);
        return result;
    }
    public async createConfig(accessToken: string, fileName: string, branchName: string, contents: string): Promise<any> {
        if (branchName === config.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName, sourcePath } = config;
        const path = `${sourcePath}/${fileName}`;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;

        const data = {
            "message": `Created ${path}`,
            "content": contents,
            "branch": branchName
        };

        const result: any = await requestExecutor('put', url, params, data);
        return result;
    }
    public async createWorkflow(accessToken: string, branchName: string, contents: string, filePath: string): Promise<any> {
        if (branchName === config.workflowConfig.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName } = config.workflowConfig;
        const sourcePath = config.workflowConfig.path;
        const path = `${sourcePath}/${filePath}`;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;

        const data = {
            "message": `Created ${path}`,
            "content": contents,
            "branch": branchName
        };

        const result: any = await requestExecutor('put', url, params, data);
        return result;
    }
    public async getPullRequests(accessToken: string, state: string, sort: string, direction: string) {
        const { repoOwner, repoName, baseBranch } = config;
        const params = { access_token: accessToken, state, sort, direction };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/pulls`;

        const result: any = await requestExecutor('get', url, params, null);
        return result;
    }
    public async createPullRequest(accessToken: string, branchName: string) {
        if (branchName === config.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName, baseBranch } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/pulls`;

        const data = {
            title: `PR for ${branchName}`,
            head: branchName,
            base: baseBranch
        };

        const result: any = await requestExecutor('post', url, params, data);
        return result;
    }
    public async updatePullRequest(accessToken: string, branchName: string, prId: string, state: string) {
        if (branchName === config.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName, baseBranch } = config;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/pulls/${prId}`;

        const data = {
            title: `PR for ${branchName}`,
            head: branchName,
            base: baseBranch,
            state
        };

        const result: any = await requestExecutor('patch', url, params, data);
        return result;
    }
    public getLoginUrl(host): string {
        const authUrl = config.authUrl;
        const { client_id } = process.env;
        const params = {
            client_id,
            redirect_uri: `${host}/${config.redirectUri}`,
            scope: config.scope,
            state: config.state,
            allow_signup: config.allowSignup
        };

        const query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

        return `${authUrl}?${query}`;
    }
    public get baseBranchSha() {
        if (this._baseBranch) {
            return this._baseBranch.commit.sha;
        } else {
            return '';
        }
    }
    public async getTableColumns(accessToken: string, tableName) {
        const { repoOwner, repoName, columnsPath } = config.dbConfig;
        const params = { access_token: accessToken };
        const path = `${columnsPath}/${tableName.toUpperCase()}.sql`;
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const file = await requestExecutor('get', url, params, null);
        return file as IFile;
    }

    public async getDataPartners(accessToken: string) {
        const { repoOwner, repoName, dataPartnerPath } = config.dbConfig;
        const params = { access_token: accessToken };
        const tableStructurePath = `${dataPartnerPath}/tables/DATA_PARTNER.sql`;
        const tableContentPath = `${dataPartnerPath}/scripts/populate_partner.sql`;
        let result = '';
        // get table structure
        const structureUrl = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${tableStructurePath}`;
        const fileStructure: any = await requestExecutor('get', structureUrl, params, null);
        const file = fileStructure as IFile;
        result += Buffer.from(file.content, 'base64').toString();
        // get insert statements then parse them
        const dataUrl = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${tableContentPath}`;
        const fileContent: any = await requestExecutor('get', dataUrl, params, null);
        const data = fileContent as IFile;
        result += Buffer.from(data.content, 'base64').toString();
        // concat them and return for further processing
        return result;
    }

    public async getFeedTypes(accessToken: string) {
        const { repoOwner, repoName, feedTypePath } = config.dbConfig;
        const params = { access_token: accessToken };
        const tableStructurePath = `${feedTypePath}/tables/FEED_TYPE.sql`;
        const tableContentPath = `${feedTypePath}/scripts/populate_feed_type.sql`;
        let result = '';
        // get table structure
        const structureUrl = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${tableStructurePath}`;
        const fileStructure: any = await requestExecutor('get', structureUrl, params, null);
        const file = fileStructure as IFile;
        result += Buffer.from(file.content, 'base64').toString();
        // get insert statements then parse them
        const dataUrl = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${tableContentPath}`;
        const fileContent: any = await requestExecutor('get', dataUrl, params, null);
        const data = fileContent as IFile;
        result += Buffer.from(data.content, 'base64').toString();
        // concat them and return for further processing
        return result;
    }

    public async getAllTables(accessToken: string) {
        const { repoOwner, repoName, columnsPath } = config.dbConfig;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${columnsPath}`;
        const files = await requestExecutor('get', url, params, null);
        return files as IFile[];
    }

    public async getBusinessRules(accessToken: string): Promise<IFile> {
        const { repoOwner, repoName, basebranch, path } = config.businessRuleConfig;
        const params = { access_token: accessToken, ref: basebranch };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const file = await requestExecutor('get', url, params, null);
        return file as IFile;
    }

    public async getWorkflows(accessToken: string, sha: string): Promise<IFile[]> {
        const { repoOwner, repoName, path } = config.workflowConfig;
        const params = { access_token: accessToken, recursive: 1, path: path };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/git/trees/${sha}`;
        const files = await requestExecutor('get', url, params, null);

        // filter workflow files from the tree
        const workflows = _.filter(files.tree || [], file => (file.type === 'blob' && _.includes(file.path, path)));

        // format it by adding data partner, feed type, name
        _.forEach(workflows, workflow => {
            const relativePath = workflow.path.replace(path, '');
            const fileRegex = /(\w+)\/(\w+)\/(.*\.sql)$/;

            const fileInfo = relativePath.match(fileRegex);
            if (fileInfo) {
                workflow.dataPartner = fileInfo[1];
                workflow.feedType = fileInfo[2];
                workflow.name = fileInfo[3];
            }
        });
        return workflows as IFile[];
    }

    public async getWorkflow(accessToken: string, branch: string, path: string): Promise<IFile[]> {
        const { repoOwner, repoName } = config.workflowConfig;
        const params = { access_token: accessToken, ref: branch };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;
        const files = await requestExecutor('get', url, params, null);
        return files as IFile[];
    }

    public async updateWorkflow(accessToken: string, path: string, branchName: string, contents: string, sha: string): Promise<any> {
        if (branchName === config.workflowConfig.baseBranch) {
            return new Error('Can\'t write into master branch');
        }

        const { repoOwner, repoName } = config.workflowConfig;
        const params = { access_token: accessToken };
        const url = `${this.baseAPIUrl}/repos/${repoOwner}/${repoName}/contents/${path}`;

        const data = {
            "message": `Updated ${path}`,
            "content": contents,
            "sha": sha,
            "branch": branchName
        };

        const result: any = await requestExecutor('put', url, params, data);
        return result;
    }
    public async executeConfig(fileName: string): Promise<any> {
        const { userName, host, configDirectory } = config.clusterConfig;
        const { privateKeyPath } = process.env;

        return new Promise((resolve, reject) => {
            try {
                this.logger.info("\n");

                this.logger.info(JSON.stringify({ type: 'start execute config in cluster', file: fileName, host, userName, at: (new Date()).toUTCString() }));
                const ssh = new node_ssh();
                const command = `spark-submit /etc/pegasus/acp-ExTra/acp_extra/application.py --config-directory ${configDirectory} --workflow_run_id 11111 --config_file ${fileName}`;

                ssh.connect({
                    host,
                    username: userName,
                    privateKey: privateKeyPath
                })
                    .then(() => {
                        this.logger.info(JSON.stringify({ type: 'connected to cluster via ssh', file: fileName, host, userName, at: (new Date()).toUTCString() }));
                        ssh.execCommand(command).then((result) => {
                            this.logger.info(JSON.stringify({ type: 'run spark command on config file', command, file: fileName, host, userName, at: (new Date()).toUTCString() }));
                            resolve(result);
                        }).catch((error) => {
                            this.logger.error(JSON.stringify({ type: 'failed to run spark command', file: fileName, host, userName, at: (new Date()).toUTCString(), error }));
                            reject(error);
                        });
                    })
                    .catch(error => {
                        this.logger.info(JSON.stringify({ type: 'failed to connect via ssh', file: fileName, host, userName, at: (new Date()).toUTCString() }));
                        reject(error);
                    });

            } catch (error) {
                this.logger.error(JSON.stringify({ type: 'failed connect to cluster via ssh', file: fileName, host, userName, at: (new Date()).toUTCString(), error }));
                reject(error);

            }
        });
    }

    public async copyToCluster(accessToken: string, content: string, fileName: string): Promise<any> {
        const { userName, host, path } = config.clusterConfig;
        const { privateKeyPath } = process.env;
        const contentBuffer = new Buffer(content, 'base64');
        const startTimeInMs = (new Date()).getTime();
        let endTimeInMs;

        return new Promise((resolve, reject) => {
            try {
                this.logger.info(JSON.stringify({ type: 'start copy config to cluster', file: fileName, host, userName, path, at: (new Date()).toUTCString() }));
                // set defaults
                scp2.defaults({
                    port: 22,
                    host,
                    username: userName,
                    privateKey: require("fs").readFileSync(privateKeyPath)
                });

                // mkdir if not present
                scp2.mkdir(path, [], (e) => {
                    if (e) {
                        reject(e);
                    }

                    // write content
                    scp2.write({
                        destination: `${path}/${fileName}`,
                        content: contentBuffer
                    }, (err, sftp) => {
                        if (err) {
                            this.logger.error(JSON.stringify({ type: 'copy config to cluster error', file: fileName, host, userName, path, at: (new Date()).toUTCString(), error: err }));
                            endTimeInMs = (new Date()).getTime();
                            reject({ error: err, duration: (endTimeInMs - startTimeInMs) / 1000 });
                        }
                        this.logger.info(JSON.stringify({ type: 'complete copy config to cluster', file: fileName, host, userName, path, at: (new Date()).toUTCString() }));
                        endTimeInMs = (new Date()).getTime();
                        resolve({ message: `Successfully copies config ${fileName} to cluster`, duration: (endTimeInMs - startTimeInMs) / 1000 });
                    });
                })

            } catch (error) {
                this.logger.error(JSON.stringify({ type: 'copy config to cluster error', file: fileName, host, userName, path, at: (new Date()).toUTCString(), error }));
                endTimeInMs = (new Date()).getTime();
                reject({ error: error, duration: (endTimeInMs - startTimeInMs) / 1000 });
            }
        });
    }

    public async executeWorkflow(partner: string, feed: string): Promise<any> {
        const { userName, host, workflowRunner } = config.clusterConfig;
        const { privateKeyPath } = process.env;

        return new Promise((resolve, reject) => {
            try {
                this.logger.info("\n");

                this.logger.info(JSON.stringify({ type: 'start execute workflow in cluster', partner, feed, host, userName, at: (new Date()).toUTCString() }));
                const ssh = new node_ssh();
                const command = `${workflowRunner} w_${partner.toUpperCase()}_${feed.toUpperCase()}`;

                ssh.connect({
                    host,
                    username: userName,
                    privateKey: privateKeyPath
                })
                    .then(() => {
                        this.logger.info(JSON.stringify({ type: 'connected to cluster via ssh', partner, feed, host, userName, at: (new Date()).toUTCString() }));
                        ssh.execCommand(command).then((result) => {
                            this.logger.info(JSON.stringify({ type: 'run workflow in cluster', command, partner, feed, host, userName, at: (new Date()).toUTCString() }));
                            resolve(result);
                        }).catch((error) => {
                            this.logger.error(JSON.stringify({ type: 'failed to run workflow', partner, feed, host, userName, at: (new Date()).toUTCString(), error }));
                            reject(error);
                        });
                    })
                    .catch(error => {
                        this.logger.info(JSON.stringify({ type: 'failed to connect via ssh', partner, feed, host, userName, at: (new Date()).toUTCString() }));
                        reject(error);
                    });

            } catch (error) {
                this.logger.error(JSON.stringify({ type: 'failed connect to cluster via ssh', partner, feed, host, userName, at: (new Date()).toUTCString(), error }));
                reject(error);

            }
        });
    }

}
