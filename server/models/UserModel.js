import { Sequelize } from "sequelize";
import db from '../config/database.js';

const {DataTypes} = Sequelize;

const User = db.define('tb_user', {
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    femail : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    fusername: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
            len: [3, 100]
        }
    },
    fpassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, 
    frefresh_token: {
        type: DataTypes.TEXT,
    }
}, {
    freezeTableName: true
});

export default User;


