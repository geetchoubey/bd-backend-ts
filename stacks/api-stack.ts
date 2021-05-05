import {Construct, Stack, StackProps} from '@aws-cdk/core';
import {Cors, RestApi} from "@aws-cdk/aws-apigateway";

export class ApiStack extends Stack {
    public api: RestApi;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.api = new RestApi(this, 'apigw', {
            restApiName: `bd-ts-backend-api-${process.env.STAGE}`,
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: [...Cors.DEFAULT_HEADERS, 'Authorization', 'X-API-Key'],
                allowMethods: Cors.ALL_METHODS
            },
            deploy: false
        });
    }
}
