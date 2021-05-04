#!/usr/bin/env node
require('dotenv').config()
import 'source-map-support/register';
import {App} from "@aws-cdk/core";
import {ApiStack} from './api-stack';
import {RequirementStack} from "./requirement-stack";
import {DeployStack} from "./deploy-stack";

const app = new App();

const apiStack = new ApiStack(app, 'api-gw-stack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});

const {methods: requirementMethods} = new RequirementStack(apiStack, 'requirement-stack', {
    restApi:  apiStack.api
});

new DeployStack(apiStack, 'deployment-stack', {
    restApi: apiStack.api,
    methods: [...requirementMethods]
})

// class RootStack extends Stack {
//
//     constructor(scope: Construct, id: string, props: StackProps) {
//         super(scope, id, props);
//         const {api} = new ApiStack(this, 'apigw-stack', {});
//
//         const requirementStack = new RequirementStack(this, 'requirement-stack', {
//             restApiId: api.restApiId,
//             rootResourceId: api.restApiRootResourceId
//         });
//
//         new DeployStack(this, 'deploy-stack', {
//             restApiId: api.restApiId,
//             methods: [...requirementStack.methods]
//         });
//     }
// }
//
// new RootStack(new App(), 'root-stack', {
//     env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
// })

// new MainStack(new App(), 'main-stack', {
//
// })