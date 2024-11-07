import { Sequelize } from "sequelize";
import db from '../config/database.js';

const { DataTypes } = Sequelize;

const Product = db.define('tb_product', {
   fname : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
   },
   fimage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
   },
   fprice : {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            notEmpty: true
        }
   },
   fdesc : {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true  
        }
   },
   furl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notEmpty: true
    }
   }
},{
    freezeTableName: true
})

export default Product;  

// (async() => {
//     await db.sync();
// })();


