#!/usr/bin/env node
require('dotenv').config()
import 'source-map-support/register';
import {App} from "@aws-cdk/core";
import {ApiStack} from './api-stack';
import {RequirementStack} from "./requirement-stack";
import {OtpStack} from "./otp-stack";
import {DeployStack} from "./deploy-stack";

const app = new App();

const apiStack = new ApiStack(app, 'api-gw-stack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});

const {methods: requirementMethods} = new RequirementStack(apiStack, 'requirement-stack', {
    restApi: apiStack.api
});

const {methods: otpMethods} = new OtpStack(apiStack, 'otp-stack', {
    restApi: apiStack.api
});

new DeployStack(apiStack, 'deployment-stack', {
    restApi: apiStack.api,
    methods: [...requirementMethods, ...otpMethods]
});