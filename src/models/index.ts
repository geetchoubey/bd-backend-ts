import sequelize from '../connection';
import {Sequelize} from 'sequelize';
import {CountryFactory} from './country';
import {CityFactory} from "./city";
import {RequirementFactory} from "./requirement";

export const Country = CountryFactory(sequelize);
export const City = CityFactory(sequelize);
export const Requirement = RequirementFactory(sequelize);

const db: any = {
    Country,
    City,
    Requirement
}

Object.keys(db).forEach((model: string) => {
    if (db[model].associate) {
        db[model].associate(db);
    }
})

export {Sequelize, sequelize};