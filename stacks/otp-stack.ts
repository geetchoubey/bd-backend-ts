import {Construct} from "@aws-cdk/core";
import {LambdaStackProps} from "./interfaces";
import {BaseLambdaStack} from "./BaseLambdaStack";
import models from "./models";

export class OtpStack extends BaseLambdaStack {

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const generateOtpFunction = this.getNodeJSFunction('generate-otp', {
            handler: 'handler',
            functionName: `bd-ts-generate-otp-${process.env.STAGE}`,
            entry: 'src/lambda/otp/generate/index.ts'
        });

        let resource = this.createResource(generateOtpFunction, 'otp');
        this.addMethod(resource, generateOtpFunction, 'POST',
            'generate-otp-validator', models(this, this.restApi).generateOtpInputModel());
    }
}