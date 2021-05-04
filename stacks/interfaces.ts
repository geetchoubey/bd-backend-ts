import {NestedStackProps} from "@aws-cdk/core";
import {Method, RestApi} from "@aws-cdk/aws-apigateway";

export interface LambdaStackProps extends NestedStackProps {
    restApi: RestApi
}

export interface DeployStackProps extends NestedStackProps {
    restApi: RestApi
    methods: Method[]
}