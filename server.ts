import * as express from 'express';
import * as  path from 'path';
import * as _ from 'lodash';
require('dotenv').load();
import App from './server/app';

const port = process.env.PORT || 8080;
const app: any = express();
// this assumes that all your app files
// `public` directory relative to where your server.js is
app.use(express.static(__dirname + '/dist'));

const regApp = new App(app);

regApp.registerApiLogger();
regApp.registerAuthApis("a07qpmjnkaxkkqboozh2");
regApp.registerConfigApis();
regApp.registerWorkflowApis();
regApp.registerErrorLogger();

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port);
console.log("Server started on port " + port);
