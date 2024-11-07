import { Sequelize } from "sequelize";

const db = new Sequelize ('db_coffee', 'aas', 'aas', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
