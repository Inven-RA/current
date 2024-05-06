const { MoleculerError } = require("moleculer").Errors;
const request = require("request");
const axios = require("axios");
const Sequelize = require("sequelize");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const IapActivities = require("./iap_activities_model");

module.exports = {
	name: "deploy",
	mixins: [ DbService ],

	adapter: new SqlAdapter("postgres://inveniraUser:password123@db:5432/inveniraBD?schema=invenirabd", {
		schema: 'invenirabd',
		logging: false,
		searchPath: 'invenirabd',
		freezeTableName: true,
		define: {
			timestamps: false,
			},
		dialectOptions: {
		  prependSearchPath: true
	  }
	  }),

	model: {
		name: "deployed_iaps",
		schema: "invenirabd",
		timestamps: false,
		define: {
			name: Sequelize.STRING,
			properties: Sequelize.JSON,
			nodes: Sequelize.JSON,
			edges: Sequelize.JSON,
		},
	},

	/**
	 * Actions
	 */
	actions: {
		async create(ctx) {
            try {
                const { name, properties, nodes, edges } = ctx.params;
				let url = await "http://localhost:"+process.env.PORT+process.env.ENDPOINT;
				const activityId = await nodes[0].act_id;

				let activity = await new Promise(function (resolve, reject) {
					request.get(url+"/activity/"+activityId, function (error, res, body) {
						if (!error && res.statusCode == 200) {
							const jsonData = JSON.parse(body);
							resolve(jsonData);
						} else {
							reject(error);
						}
					});
				});

				// let deployURL = await new Promise(function (resolve, reject) {
				// 	request.post(activity.user_url+"/"+activityId, function (error, res, body) {
				// 		if (!error && res.statusCode == 200) {
				// 			const jsonData = JSON.parse(body);
				// 			console.log("Json response: " + JSON.stringify(jsonData));
				// 			resolve(jsonData.deployURL);
				// 		} else {
				// 			reject(error);
				// 		}
				// 	});
				// });
                deployURL = "http://localhost:3002/";
                const iap = await this.adapter.model.create({
                    name,
                    properties,
                    nodes,
                    edges,
                });

                await IapActivities(this.adapter.model.sequelize).create({
                    iap_id: iap.id,
                    activity_id: activityId,
                    act_name: activity.name,
                    deployment_url: deployURL,
                });

                return iap;
            } catch (error) {
                throw new MoleculerError("Failed to create IAP: " + error.message, 500);
            }
        },

		async get(ctx) {
            const iap = await this.adapter.model.findOne({ where: { id: ctx.params.id} });
            if (!iap) {
                throw new MoleculerError("Deployed IAP not found", 404);
            }
            return iap;
        },

		// /**
		//  * Triggers a deployed activity and redirects to configured url, with given configuration
		//  *
		//  * @actions
		//  * @param {String} id - Activity ID
		//  * @returns {Object} Activity
		//  */

         async trigger(ctx) {
             try {
                 const { id, userId } = ctx.params;
                 const url = `http://localhost:${process.env.PORT}${process.env.ENDPOINT}`;

                 const userResponse = await axios.get(`${url}/users/${userId}`);
                 let user = userResponse.data;
                 this.logger.info(user);
                 const activityResponse = await axios.get(`${url}/iap/${id}`);
                 const activity = activityResponse.data;

                 const deployed_iap = await this.adapter.model.findByPk(id);
                 if (!deployed_iap) throw new MoleculerError("Deployed IAP not found", 404);

                 const json_payload = {
                     "activityID": id,
                     "inveniraStdID": user._id,
                     "json_params": activity.nodes[0].params
                 };

                 const redirectResponse = await axios.get(deployed_iap.deployURL, { data: json_payload });
                 const redirectURL = redirectResponse.data.deployURL;

                 ctx.meta.$responseType = "redirect";
                 ctx.meta.$location = redirectURL;
                 return { redirectURL };
             } catch (error) {
                 throw new MoleculerError("Failed to initiate activity: " + error.message, 500);
             }
         },

        async getActivities(ctx){
            const {id} = ctx.params;
            const activities = await IapActivities(this.adapter.model.sequelize).findAll({ where: { iap_id: id } });
            return activities;
        },

		async list(ctx) {
            const iaps = await this.adapter.model.findAll();
            return iaps;
        },

		async update(ctx) {
            try {
                const { id, name, description, nodes, edges } = ctx.params;
                const iap = await this.adapter.model.findOne({ where: { id } });

                if (!iap) {
                    throw new MoleculerError("Deployed IAP not found", 404);
                }

                await iap.update({ name, description, nodes, edges });
                return iap;
            } catch (error) {
                throw new MoleculerError("Failed to update IAP: " + error.message, 500);
            }
        },

        async remove(ctx) {
            const iap = await this.adapter.model.findOne({ where: { id: ctx.params.id } });
            if (!iap) {
                throw new MoleculerError("Deployed IAP not found", 404);
            }
            await iap.destroy();
            return "IAP removed";
        },
	},
};
