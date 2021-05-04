import {Sequelize} from "sequelize";

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PWD!, {
    host: process.env.DB_HOST!,
    dialect: 'postgres',
    port: parseInt(process?.env?.DB_PORT || '5432'),
    dialectOptions: {},
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        match: [
            /SequelizeDatabaseError/,
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /SequelizeBaseError/,
            /Error/
        ],
        max: 2 // Max retries = 1; 1 retry after the first attempt;
    }
});

export default sequelize;