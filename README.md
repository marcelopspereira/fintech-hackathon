Fintech Hackathon Entry
=======================

The initial API stub for our entry to the Fintech Hackathon. Currently running live on OpenShift at:

[http://fintech-fintechhackathon.rhcloud.com/](http://fintech-fintechhackathon.rhcloud.com/)

1. Run `npm install` to download and set up all required libraries.
2. Start a MongoDB instance locally, or modify the configuration file to point to an existing DB.
3. Run `launch.sh` to start the server, note that this launch script requires `supervisor` to run.
   It can be installed with `npm install -g supervisor`

Backend Technologies
====================

* [Node.js](http://nodejs.org/)
* [MongoDB](http://www.mongodb.org/)
* [OpenShift](https://www.openshift.com/)
* [Express](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Bunyan](https://github.com/trentm/node-bunyan)

Repo layout
===========

    +-------------------------------------+---------------------------------------+
    |                Item                 |              Description              |
    +-------------------------------------+---------------------------------------+
    | .openshift/                         | OpenShift deployment recipe           |
    | .openshift/action_hooks/pre_build   | Run after every git push pre buidl.   |
    | .openshift/action_hooks/build       | The build script                      |
    | .openshift/action_hooks/deploy      | Run after build completes             |
    | .openshift/action_hooks/post_deploy | Runs after app restarts               |
    | /src                                | Backend source                        |
    | /schemas                            | Backend and API schemas               |
    | /public                             | Frontend source                       |
    | package.json                        | Project meta data and dependency list |
    | config.json                         | MongoDB connection info               |
    | launch.sh                           | Starts the server                     |
    | server.js                           | The server itself                     |
    +-------------------------------------+---------------------------------------+

Environment Configuration
=========================

When running locally the server will bind to localhost port 8080. When deployed on OpenShift
it will bind to whatever address and port that OpenShift defines via the environment variables.

When running locally it will attempt to connect to a local MongoDB instance without authentication.
When running on OpenShift it will connect to the MongoDB database specified in the environment
variables.

