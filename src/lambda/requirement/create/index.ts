import {Context} from "aws-lambda";

export const handler = async (event: any, context: Context) => {
    return {
        message: 'Created requirement',
        statusCode: 0
    }
};