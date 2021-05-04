import {BuildOptions, DataTypes, Model, Optional, Sequelize} from "sequelize";
import {encrypt} from "../utils/helpers";

export interface OtpAttributes {
    id?: number
    otp: string
    hash: string
    createdAt?: Date
    updatedAt?: Date
}
interface OtpCreationAttributes extends Optional<OtpAttributes, 'id'> {}
export interface OtpModel extends Model<OtpAttributes>, OtpCreationAttributes {}

export type OtpStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): OtpModel;
};

export function OtpFactory (sequelize: Sequelize): OtpStatic {
    return <OtpStatic>sequelize.define('otp', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        otp: DataTypes.STRING,
        hash: {
            type: DataTypes.STRING,
            async set(mobileNumber: string) {
                const otp = this.getDataValue('otp')
                this.setDataValue('hash', await encrypt(mobileNumber + otp))
            }
        }
    }, {
        tableName: 'otp'
    });
}