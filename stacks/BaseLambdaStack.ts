import {Construct, NestedStack} from '@aws-cdk/core';
import {LambdaStackProps} from "./interfaces";
import {
    LambdaIntegration,
    Method,
    Model,
    PassthroughBehavior,
    RequestValidator,
    Resource,
    RestApi
} from "@aws-cdk/aws-apigateway";
import {NodejsFunction, NodejsFunctionProps} from "@aws-cdk/aws-lambda-nodejs";
import {IFunction, Runtime} from "@aws-cdk/aws-lambda";

const statuses: { [index: string]: string; } = {
    "200": "",
    "400": "[\\s\\S]*\\[400\][\\s\\S]*",
    "401": "[\\s\\S]*\\[401\\][\\s\\S]*",
    "403": "[\\s\\S]*\\[403\\][\\s\\S]*",
    "404": "[\\s\\S]*\\[404\\][\\s\\S]*",
    "422": "[\\s\\S]*\\[422\\][\\s\\S]*",
    "500": "[\\s\\S]*(Process\\s?exited\\s?before\\s?completing\\s?request|\\[500\\])[\\s\\S]*",
    "502": "[\\s\\S]*\\[502\\][\\s\\S]*",
    "504": "([\\s\\S]*\\[504\\][\\s\\S]*)|(^[Task timed out].*)"
}

const requestMapper: string = `{
    "body": $input.json('$'),
    "headers": {
        #foreach($header in $input.params().header.keySet())
            "header": "$util.escapeJavaScript($input.params().header.get($header))" #if($foreach.hasNext),#end
        #end
    },
    "method": "$context.httpMethod",
    "params": {
        #foreach($param in $input.params().path.keySet())
            "$param": "$util.escapeJavaScript($input.params().path.get($param))" #if($foreach.hasNext), #end
        #end
    },
    "query": {
        #foreach($queryParam in $input.params().querystring.keySet())
            "$queryParam": "$util.escapeJavaScript($input.params().querystring.get($param))" #if($foreach.hasNext), #end
        #end
    }
}`

export abstract class BaseLambdaStack extends NestedStack {
    public readonly methods: Method[] = [];
    protected restApi: RestApi;

    protected constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);
        this.restApi = props.restApi;
    }

    getNodeJSFunction(name: string, props: NodejsFunctionProps) {
        return new NodejsFunction(this, name, {
            ...props,
            runtime: Runtime.NODEJS_12_X,
            environment: {
                ...props.environment,
                DB_HOST: process.env.DB_HOST || 'localhost',
                DB_USER: process.env.DB_USER || 'root',
                DB_PASSWORD: process.env.DB_PASSWORD || '',
                DB_NAME: process.env.DB_NAME || '',
                STAGE: process.env.STAGE || 'dev'
            }
        });
    }

    createResource(nodejsFunction: NodejsFunction, pathPart: string): Resource {
        return this.restApi.root.addResource(pathPart);
    }

    addMethod(resource: Resource, handler: IFunction, httpMethod: string, requestValidatorName: string, model: Model) {
        this.methods.push(
            resource.addMethod(
                httpMethod,
                new LambdaIntegration(handler,
                    {
                        proxy: false,
                        passthroughBehavior: PassthroughBehavior.NEVER,
                        requestTemplates: {
                            'application/json': requestMapper
                        },
                        integrationResponses: Object.keys(statuses).map(status => ({
                            statusCode: status,
                            selectionPattern: statuses[status],
                            responseParameters: {
                                "method.response.header.Access-Control-Allow-Headers":
                                    "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                                "method.response.header.Access-Control-Allow-Origin": "'*'",
                                // "method.response.header.Access-Control-Allow-Credentials":
                                //     "'false'",
                                "method.response.header.Access-Control-Allow-Methods":
                                    "'OPTIONS,GET,PUT,POST,DELETE'",
                            }
                        }))
                    }),
                {
                    requestValidator: new RequestValidator(this, requestValidatorName, {
                        restApi: this.restApi,
                        requestValidatorName: `${requestValidatorName}-${process.env.STAGE}`,
                        validateRequestBody: true
                    }),
                    requestModels: {
                        'application/json': model
                    },
                    methodResponses: Object.keys(statuses).map(status => ({
                        statusCode: status,
                        responseParameters: {
                            "method.response.header.Access-Control-Allow-Headers": true,
                            "method.response.header.Access-Control-Allow-Methods": true,
                            // "method.response.header.Access-Control-Allow-Credentials": true,
                            "method.response.header.Access-Control-Allow-Origin": true,
                        }
                    }))
                })
        )
    }
}