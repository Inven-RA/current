const { MoleculerError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const DbService  = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

module.exports = {
    name: "activity",
    mixins: [DbService],
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
        name: "activity",                               //tabela "principal"
		schema: "invenirabd",
		timestamps: false,
        define: {
            name: Sequelize.STRING,
			properties: Sequelize.JSON,
			config_url: Sequelize.STRING,
			json_params: Sequelize.STRING,
			//json_params_url: Sequelize.STRING,
			user_url: Sequelize.STRING,
			analytics: Sequelize.STRING,
			//analytics_url: Sequelize.STRING,
			//analytics_list_url: Sequelize.TEXT, 
			is_deployed: Sequelize.BOOLEAN
        },
    },

	actions: {
		/**
		 * Register a new activity
		 *
		 * @actions
		 * @param {Object} Activity - Activity details. Name is mandatory
		 * @returns {Object} Created entity + id
		 */
		async create(ctx) {
			const { name, properties, config_url, json_params, user_url, analytics} = ctx.params;
			try {
				const activity = await this.adapter.model.create({ name, properties, config_url, json_params, user_url, analytics }); //insert
				return activity;
			} catch (error) {
				throw new MoleculerError("Failed to create activity: " + error.message, 500);
			}
		},
		/**
		 * Delete an activity
		*
		 * @actions
		 * @param {String} id - Activity ID
		 * @returns
		 */
		async remove(ctx) {
			try {
				const activity = await this.adapter.model.findOne({ where: { id: ctx.params.id } });
				if (!activity) {
					throw new MoleculerError("Activity not found", 404);
				}
				await activity.destroy();
				return;
			} catch (error) {
				throw new MoleculerError("Failed to delete activity: " + error.message, 500);
			}
		},
		/**
		 * Update an activity
		 *
		 * @actions
		 * @param {Object} Activity - Activity details. Name is mandatory
		 * @returns {Object} Activity
		 */
		async update(ctx) {
			const { name, properties, config_url, json_params, user_url, analytics, id} = ctx.params;
			try {
				const activity = await this.adapter.model.findOne({ where: { id } });
				if (!activity) {
					throw new MoleculerError("Activity not found", 404);
				}
				await activity.update({ name, properties, config_url, json_params, user_url, analytics });
				return activity;
			} catch (error) {
				throw new MoleculerError("Failed to update activity: " + error.message, 500);
			}
		},
		/**
		 * Get Activity
		 *
		 * @actions
		 * @param {String} id - Activity ID
		 * @returns {Object} Activity if found
		 */
		async get(ctx) {
			try {
				const activity = await this.adapter.model.findOne({ where: { id: ctx.params.id } });
				if (!activity) {
					throw new MoleculerError("Activity not found", 404);
				}
				return activity;
			} catch (error) {
				throw new MoleculerError("Failed to get activity: " + error.message, 500);
			}
		},
		/**
		 * List Activities
		 *
		 * @actions
		 * @returns {Array} List of available Activities
		 */
		async list(ctx) {
			const {all, name} = ctx.params;
			if (all) {
				const activities = await this.adapter.model.findAll();
				return activities;
			}
			else{
				const activities = await this.adapter.model.findAll({
					where: { 
						name: { 
							[Sequelize.Op.iLike]: `%${name}%` 
						} 
					} 
				}); 
				return activities;
			}
		},

	},
};
