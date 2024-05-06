const { MoleculerError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const DbService  = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

module.exports = {
    name: "iap",
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
        name: "iaps",                               //tabela "principal"
		schema: "invenirabd",
		timestamps: false,
        define: {
            name: Sequelize.STRING,
			properties: Sequelize.JSON,
			nodes: Sequelize.JSON,
			edges: Sequelize.JSON,
        },
    },
    actions: {
        async create(ctx) {
			const { name, properties, nodes, edges } = ctx.params;
			try {
				const iap = await this.adapter.model.create({ name, properties, nodes, edges }); 
				return iap;
			} catch (error) {
				throw new MoleculerError("Failed to create iap: " + error.message , 500);
			}
		},

		async get(ctx) {
			const iap = await this.adapter.model.findOne({ where: { id: ctx.params.id } });
			if (!iap) {
				throw new MoleculerError("IAP not found", 404);
			}
			return iap;
		},

		async list(ctx) {
			const {all, name} = ctx.params;
			if (all) {
				const iaps = await this.adapter.model.findAll();
				return iaps;
			}
			else{
				const iaps = await this.adapter.model.findAll({
					where: { 
						name: { 
							[Sequelize.Op.iLike]: `%${name}%` 
						} 
					} 
				}); 
				return iaps;
			}
		},

		async update(ctx) {
			try {
				const { name, properties, nodes, edges, id} = ctx.params; 
				
				const iap = await this.adapter.model.findOne({ where: { id: id } });

				if (!iap) {
					throw new MoleculerError("IAP not found", 404);
				}

				await iap.update({ name, properties, nodes, edges });

				return "IAP updated";
			}
			catch (error) {
				throw new MoleculerError("Failed to update iap: " + error.message , 500);
			}
		},
		
		async remove(ctx) {
			const iap = await this.adapter.model.findOne({ where: { id: ctx.params.id } });
			if (!iap) {
				throw new MoleculerError("IAP not found", 404);
			}
			await iap.destroy();
			return iap;
		},
	},
};