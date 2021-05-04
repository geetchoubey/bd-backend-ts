import {BuildOptions, DataTypes, Model, Optional, Sequelize} from "sequelize";
import {BLOOD_TYPES, REQUIREMENT_STATUS} from "../utils/constants";

export interface RequirementAttributes {
    id?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    bloodType: string
    plasmaRequired: boolean
    quantity: number
    doctorRegistrationId: string
    status: 'Required' | 'Found'
    createdAt?: Date
    updatedAt?: Date
}
interface RequirementCreationAttributes extends Optional<RequirementAttributes, 'id'> {}
export interface RequirementModel extends Model<RequirementAttributes>, RequirementCreationAttributes {}

export type RequirementStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): RequirementModel;
};

export function RequirementFactory (sequelize: Sequelize): RequirementStatic {
    const requirement = <RequirementStatic>sequelize.define('requirement', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        bloodType: {
            type: DataTypes.ENUM,
            values: BLOOD_TYPES
        },
        plasmaRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        quantity: {
            type: DataTypes.FLOAT
        },
        doctorRegistrationId: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM,
            values: REQUIREMENT_STATUS,
            defaultValue: REQUIREMENT_STATUS[0]
        }
    }, {
        tableName: 'requirement'
    });


    // @ts-ignore
    requirement.associate = ((models:any) => {
        models.Requirement.belongsTo(models.City);
    });

    return requirement;
}