import {JsonSchemaType, Model, RestApi} from "@aws-cdk/aws-apigateway";
import {BLOOD_TYPES} from "../src/utils/constants";
import {Construct} from "@aws-cdk/core";

export default (scope: Construct, restApi: RestApi) => ({
    createRequirementModel(): Model {
        return new Model(scope, 'create-request-model', {
            modelName: `CreateRequestModel${process.env.STAGE}`,
            restApi: restApi,
            contentType: 'application/json',
            schema: {
                type: JsonSchemaType.OBJECT,
                properties: {
                    firstName: {
                        type: JsonSchemaType.STRING,
                        minLength: 3
                    },
                    lastName: {
                        type: JsonSchemaType.STRING,
                        minLength: 3
                    },
                    email: {
                        type: JsonSchemaType.STRING
                    },
                    phone: {
                        type: JsonSchemaType.STRING,
                        pattern: "^\\d{10}$"
                    },
                    bloodType: {
                        type: JsonSchemaType.STRING,
                        enum: BLOOD_TYPES
                    },
                    doctorRegistrationId: {
                        type: JsonSchemaType.STRING,
                        pattern: "^\\d{10}$"
                    },
                    quantity: {
                        type: JsonSchemaType.NUMBER,
                        maximum: 5,
                        minimum: 1
                    },
                    cityId: {
                        type: JsonSchemaType.INTEGER
                    },
                    otp: {
                        type: JsonSchemaType.STRING
                    }
                },
                required: ["firstName", "lastName", "phone", "email", "bloodType", "doctorRegistrationId", "quantity", "cityId", "otp"]
            }
        })
    },
    generateOtpInputModel(): Model {
        return new Model(scope, 'otp-input-model', {
            modelName: `OtpRequestModel${process.env.STAGE}`,
            restApi: restApi,
            contentType: 'application/json',
            schema: {
                type: JsonSchemaType.OBJECT,
                properties: {
                    phone: {
                        type: JsonSchemaType.STRING,
                        pattern: "^\\d{10}$"
                    }
                },
                required: ['phone']
            }
        })
    }
})