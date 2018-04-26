import Store from './store';

export default {
    getConfigs: (req, res) => {
        const { branch, perPage, page } = req.query;
        const { accessToken } = req.session;

        Store.instance.getConfigs(accessToken, branch, perPage, page)
            .then((contents) => {
                res.json(contents);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    return res.json([]);
                }
                res.status(500).send('failed to fetch contents');
            });
    },
    getContent: (req, res) => {
        const filePath = req.query.filePath;
        const branch = req.query.branch;
        const { accessToken } = req.session;

        Store.instance.getContent(accessToken, filePath, branch)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                console.log('Error: ', error);
                res.status(500).send('failed to fetch config');
            });
    },
    updateConfig: (req, res) => {
        const { contents, sha, branch } = req.body;
        const filePath = req.body.path;
        const { accessToken } = req.session;

        try {
            Store.instance.updateConfig(
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
    copyToCluster: (req, res) => {
        const {contents, name} = req.body;
        const {accessToken}= req.session;

        try {
            Store.instance.copyToCluster(
                accessToken,
                contents,
                name
            )
                .then((result: any) => { res.json(result); })
                .catch((error) => { res.status(500).send('Failed to copy config to cluster ', error.message); });

        } catch (error) {
            res.status(500).send('Failed to copy config to cluster ', error.message);
        }
    },
    executeConfig: (req, res) => {
        const {name} = req.body;

        try {
            Store.instance.executeConfig(name)
                .then((result: any) => { res.json(result); })
                .catch((error) => { res.status(500).send('Failed to execute config in cluster ', error.message); });

        } catch (error) {
            res.status(500).send('Failed to execute config in cluster ', error.message);
        }
    },
    createConfig: (req, res) => {
        const { fileName, content, branch } = req.body;
        const { accessToken } = req.session;

        try {
            Store.instance.createConfig(
                accessToken,
                fileName,
                branch,
                content
            )
                .then((result: any) => { res.json(result.content); })
                .catch((error) => {
                    res.status(500).send('Failed to create config');
                });
        } catch (error) {
            res.status(500).send('Failed to create config');
        }
    },
    getConfigTables: (req, res) => {
        const { name, branch } = req.query;
        const { accessToken } = req.session;

        try {
            Store.instance.getTables(accessToken, name, branch)
                .then((result: any) => { res.json(result); })
                .catch((error) => {
                    res.status(500).send('Failed to create config');
                });
        } catch (error) {
            res.status(500).send('Failed to create config');
        }
    }
};
