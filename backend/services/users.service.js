const { MoleculerError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const DbService  = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const { actions } = require("./host_system_handler.service.js");
const bcrypt = require("bcrypt");

module.exports = {
    name: "users",
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
        name: "users",                               //tabela "principal"
		schema: "invenirabd",
		timestamps: false,
        define: {
            name: Sequelize.STRING,
			email: Sequelize.STRING,
            password: Sequelize.STRING
        },
    },

    actions: {
        async create(ctx){
            const {name, email, password} = ctx.params;
    
            if(password.length < 8){
                throw new MoleculerError('Password must be at least 8 characters', 400);
            }
    
            const existingUser = await this.adapter.model.findOne({ where: { email } });
            if(existingUser){
                throw new MoleculerError('Email already exists', 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.adapter.model.create({
                name,
                email,
                password: hashedPassword
            });

            return user;
        },

        async login(ctx){
            const {email, password} = ctx.params;
    
            const user = await this.adapter.model.findOne({ where: { email } });
            if(!user){
                throw new MoleculerError('User not found', 404);
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch){
                throw new MoleculerError('Invalid password', 400);
            }
    
            return user;
        },


        async get(ctx){
            const { id } = ctx.params;
    
            const user = await this.adapter.model.findOne({ where: { id } });
            if(!user){
                throw new MoleculerError('User not found', 404);
            }
    
            return user;
        },

        
        async list(ctx){
            const users = await this.adapter.model.findAll();
    
            return users;
        },

        async update(ctx){
            const { id, name, email, password } = ctx.params;
        
            // Busca o usuário pelo ID
            const userToUpdate = await this.adapter.model.findOne({ where: { id } });
            if(!userToUpdate){
                throw new MoleculerError('User not found', 404);
            }
            const fieldsToUpdate = {};
            if (name !== undefined) fieldsToUpdate.name = name;
            if (email !== undefined) fieldsToUpdate.email = email;
            if (password !== undefined) fieldsToUpdate.password = await bcrypt.hash(password, 10);
            // Atualiza o usuário
            await userToUpdate.update(fieldsToUpdate);
        
            // Retorna o usuário atualizado
            return userToUpdate;
        },

        async remove(ctx){
            const { id } = ctx.params;
        
            // Busca o usuário pelo ID
            const userDelete = await this.adapter.model.findOne({ where: { id } });
            if(!userDelete){
                throw new MoleculerError('User not found', 404);
            }
        
            // Deleta o usuário
            await userDelete.destroy();
        
            // Retorna uma mensagem de sucesso
            return { message: 'User deleted successfully' };
        }
    }
}