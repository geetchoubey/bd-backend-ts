import {Context} from "aws-lambda";

export const handler = async (event: any, context: Context) => {
    return {
        message: 'Generated OTP',
        statusCode: 0
    };
};