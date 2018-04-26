import Store from './store';
import * as sql from 'sql.js';

const replaceAll = (str: string, target: string, replacement: string) => {
    return str.split(target).join(replacement);
};

export default {
    getFeedTypes: (req, res) => {
        const { accessToken } = req.session;
        const db = new sql.Database();

        Store.instance.getFeedTypes(accessToken).then((result) => {
            result = replaceAll(result, 'acp_dictionary.feed_type', 'feed_type');
            // To-Do : swati - Change sqlLite to the database used by acp_ods
            // work around, sqllite does not support ON
            result = replaceAll(result, ' ON UPDATE', '');
            // work around, sqllite does not support IGNORE
            result = replaceAll(result, 'INSERT IGNORE', 'INSERT');
            db.run(result);
            const feedTypes = db.exec(`select * from feed_type`);
            db.close();
            return res.json({ feedTypes: feedTypes[0].values });
        }).catch(error => {
            console.log('failed to fetch feed types');
            console.log(error);
            res.status(500).send('failed to fetch feed types');
        });
    }
};
