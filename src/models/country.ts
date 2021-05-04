import {BuildOptions, DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface CountryAttributes {
    id?: number
    name: string
}
interface CountryCreationAttributes extends Optional<CountryAttributes, 'id'> {}
export interface CountryModel extends Model<CountryAttributes>, CountryCreationAttributes {}

export type CountryStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): CountryModel;
};

export function CountryFactory (sequelize: Sequelize): CountryStatic {
    return <CountryStatic>sequelize.define("country", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: false,
        tableName: 'country'
    });
}