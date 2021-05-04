import {BuildOptions, DataTypes, Model, Optional, Sequelize} from "sequelize";

export interface CityAttributes {
    id?: number
    name: string
}
interface CityCreationAttributes extends Optional<CityAttributes, 'id'> {}
export interface CityModel extends Model<CityAttributes>, CityCreationAttributes {}

export type CityStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): CityModel;
};

export function CityFactory (sequelize: Sequelize): CityStatic {
    const city = <CityStatic>sequelize.define("city", {
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
        tableName: 'city',
        timestamps: false
    });


    // @ts-ignore
    city.associate = ((models:any) => {
        models.City.belongsTo(models.Country);
    });

    return city;
}