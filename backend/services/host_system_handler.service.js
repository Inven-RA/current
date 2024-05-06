const { MoleculerClientError } = require("moleculer").Errors;
const { Pool } = require("pg");
const moodle_client = require("moodle-client");

const db = new Pool({
    user: 'inveniraUser',
    host: 'localhost',
    database: 'inveniraBD',
    password: 'password123',
    port: 5432,
});

db.connect();

module.exports = {
	name: "host_system_handler",
 	/* mixins: [
        DbService("users")
    ], */

	settings: {

		rest: "users/",

		/** Public fields */
		fields: [],

		/** Validator schema for entity */
		entityValidator: {}
	},

	/**
	 * Actions
	 */
	actions: {
				/**
		 * Register a new iap
		 *
		 * @actions
		 * @param {Object} user - User details.
		 * @returns {Object} Created entity + id
		 */
		create: {
			rest: "POST /:lmsStdId/:iap",
			params: {
				lmsStdId: { type: "string" },
				iap: { type: "string" }
			},
			async handler(ctx) {
				try {
                    const { lmsStdId, iap } = ctx.params;
                    this.logger.info("Create user: " + JSON.stringify(ctx.params));
                    const query = `INSERT INTO users (lms_std_id, iap) VALUES ($1, $2) RETURNING *`;
                    const values = [lmsStdId, iap];
                    const result = await db.query(query, values);
                    return result.rows[0];
                } catch (error) {
                    throw new MoleculerClientError("Failed to create user: " + error.message, 500);
                }
			}
		},
		/**
		 * Get user
		 *
		 * @actions
		 * @param {String} id - IAP ID
		 * @returns {Object} IAP if found
		 */
		find: {
			rest: "GET /:lmsStdId/:iap",
			params: {
				lmsStdId: { type: "string" },
				iap: { type: "string" }
			},
			async handler(ctx) {
				try {
                    const { lmsStdId, iap } = ctx.params;
                    this.logger.info("Search by USER ID: " + lmsStdId);
                    const query = `SELECT * FROM users WHERE lms_std_id = $1 AND iap = $2`;
                    const result = await db.query(query, [lmsStdId, iap]);
                    return result.rows[0] || {};
                } catch (error) {
                    throw new MoleculerClientError("Failed to find user: " + error.message, 500);
                }
			}
		},
		/**
		 * List Users from Moodle
		 *
		 * @actions
		 * @returns {Array} List of users
		 */
	},

	methods: {
		init_moodle() {
			moodle_client.init({
				wwwroot: "http://localhost",
				token: "51dd38d7539155560e87974c2f843686"

			}).then(client => {
				return client.call({
					wsfunction: "core_user_get_users_by_field",
					method: "GET",
					args: {
						field: "email",
						values: ["api@invenira.com"]
					}
				}).then(response => {
					//this.logger.info("Moodle Response: " + JSON.stringify(response));
					console.log("Moodle Response: " + JSON.stringify(response));
				});

			}).catch(err => {
                console.error("Unable to initialize moodle client: " + err);
            });
		}

	}
};
