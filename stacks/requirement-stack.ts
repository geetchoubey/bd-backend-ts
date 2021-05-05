import {Construct} from "@aws-cdk/core";
import {LambdaStackProps} from "./interfaces";
import {BaseLambdaStack} from "./BaseLambdaStack";
import models from "./models";

export class RequirementStack extends BaseLambdaStack {

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);
        const createRequirementFunction = this.getNodeJSFunction('create-requirement', {
            handler: 'handler',
            functionName: `bd-ts-create-requirement-${process.env.STAGE}`,
            entry: 'src/lambda/requirement/create/index.ts'
        });

        let resource = this.createResource(createRequirementFunction, 'requirement');
        this.addMethod(resource, createRequirementFunction, 'POST',
            'create-requirement-validator', models(this, this.restApi).createRequirementModel())
    }
}