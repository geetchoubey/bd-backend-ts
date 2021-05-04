import {Construct, Stack, StackProps} from '@aws-cdk/core';
import {Cors, Deployment, LambdaIntegration, RestApi, Stage} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {Runtime} from "@aws-cdk/aws-lambda";

export class MainStack extends Stack {
    public api: RestApi

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.api = new RestApi(this, 'apigw', {
            deploy: false,
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: ['Authorization']
            }
        });
        const createRequirementFunction = new NodejsFunction(this, 'create-requirement', {
            runtime: Runtime.NODEJS_12_X,
            handler: 'handler',
            entry: 'src/lambda/requirement/create/index.ts'
        });
        this.api.root.addResource('requirement').addMethod('GET', new LambdaIntegration(createRequirementFunction));

        const deployment = new Deployment(this, 'deployment', {
            api: this.api
        });
        // deployment.node.addDependency([method])
        new Stage(this, 'stage', {
            deployment,
            stageName: process.env.STAGE || 'dev',
            variables: {
                TEST_STAGE_VAR: 'TESTING FROM STAGE VAR'
            }
        });
    }
}
