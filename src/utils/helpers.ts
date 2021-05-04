import * as bcrypt from "bcrypt";
import {SNS} from 'aws-sdk';

export const encrypt = async (str: string | number): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(str, salt);
}

export const compare = (source: string | number, encryptedString: string): Promise<boolean> => {
    return bcrypt.compare(source, encryptedString);
}

export const match = (str: string, length: number = 10): boolean => !!str.match(new RegExp(`^\\d{${length}}`, 'g'));

export const sendSms = (message: string, phone: string, countryCode: string = '+91') => {
    return new SNS().publish({
        PhoneNumber: countryCode + phone,
        Message: message,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'BLDBNK'
            }
        }
    }).promise();
}