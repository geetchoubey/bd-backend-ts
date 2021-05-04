import {Construct, NestedStack} from "@aws-cdk/core";
import {DeployStackProps} from "./interfaces";
import {Deployment, Stage} from "@aws-cdk/aws-apigateway";

export class DeployStack extends NestedStack {

    constructor(scope: Construct, id: string, props: DeployStackProps) {
        super(scope, id, props);
        const deployment = new Deployment(this, 'Deployment', {
            api: props.restApi
        });
        deployment.node.addDependency(...props.methods)
        new Stage(this, 'Stage', {
            deployment,
            stageName: process.env.STAGE || 'qa'
        });
    }
}