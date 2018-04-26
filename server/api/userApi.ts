import Store from './store';
import config from './storeConfig';

export default {
    getUserInfo: (req, res) => {
        const { code, state } = req.query;
        if (state !== config.state) {
            res.status(401).send('Failed to login');
            return;
        }

        req.session.user = {};
        Store.instance.getAccessToken(code)
            .then((tokenInfo) => {
                req.session.accessToken = tokenInfo.access_token;
                return Store.instance.getUserInfo(tokenInfo.access_token);
            })
            .then((response) => {
                req.session.user = response;
                req.session.user.loggedIn = true;
                res.json(req.session.user);
            })
            .catch((error) => {
                req.session.user.loggedIn = false;
                res.status(401).send('Failed to login');
            });
    },
    getUser: (req, res) => {
        if (req.session.user && req.session.user.loggedIn) {
            res.json(req.session.user);
        } else {
            res.json({ loggedIn: false });
        }
    },
    getLoginUrl: (req, res) => {
        const host = req.headers.host;
        try {
            const url = Store.instance.getLoginUrl(`${req.protocol}://${host}`);
            res.json({ loginUrl: url });
        } catch (error) {
            res.status(500).send('Failed to create login url');
        }
    },
    logout: (req, res) => {
        req.session.destroy(() => {
            res.json({ success: true });
        });
    },
};
