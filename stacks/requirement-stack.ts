import {Construct} from "@aws-cdk/core";
import {LambdaStackProps} from "./interfaces";
import {BaseLambdaStack} from "./BaseLambdaStack";
import {RequestValidator} from "@aws-cdk/aws-apigateway";
import models from "./models";

export class RequirementStack extends BaseLambdaStack {

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);
        const createRequirementFunction = this.getNodeJSFunction('create-requirement', {
            handler: 'handler',
            entry: 'src/lambda/requirement/create/index.ts'
        });

        let resource = this.createResource(createRequirementFunction, 'requirement');
        this.addMethod(resource, createRequirementFunction, 'POST',
            {
                requestValidator: new RequestValidator(this, 'create-requirement-validator', {
                    restApi: this.restApi,
                    requestValidatorName: `create-requirement-validator-${process.env.STAGE}`,
                    validateRequestBody: true
                }),
                requestModels: {
                    'application/json': models(this, this.restApi).createRequirementModel()
                }
            });
    }
}