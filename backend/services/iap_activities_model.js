const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const IapActivity = sequelize.define("iap_activities", {
        iap_id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false
        
        },
        activity_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        act_name: {
            type: Sequelize.INTEGER
        },
        deployment_url:{
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });

    return IapActivity;
};
