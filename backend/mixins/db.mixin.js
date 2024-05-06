//"use strict";
//const path = require("path");
//const mkdir = require("mkdirp").sync;
// const DbService = require("moleculer-db");

// module.exports = function (collection) {
// 	if (process.env.MONGO_URI) {
// 		// Mongo adapter
// 		const MongoAdapter = require("moleculer-db-adapter-mongo");
// 		return {
// 			mixins: [DbService],
// 			adapter: new MongoAdapter(process.env.MONGO_URI),
// 			collection
// 		};
// 	}

// };

/*
// Create data folder
mkdir(path.resolve("./data"));
return {
	mixins: [DbService],
	adapter: new DbService.MemoryAdapter({
		filename: `./data/${collection}.db`
	}),
	methods: {
		entityChanged(type, json, ctx) {
			return this.clearCache().then(() => {
				const eventName = `${this.name}.entity.${type}`;
				this.broker.emit(eventName, { meta: ctx.meta, entity: json });
			});
		}
	}
};
};*/


/*
const MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var db

MongoClient.connect('mongodb+srv://admin:admin@invenira-8mald.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('invenira')
    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
}) */
