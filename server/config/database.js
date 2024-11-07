import { Sequelize } from "sequelize";

const db = new Sequelize ('db_coffee', '', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
