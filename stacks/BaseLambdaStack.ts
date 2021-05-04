import {Construct, NestedStack} from '@aws-cdk/core';
import {LambdaStackProps} from "./interfaces";
import {LambdaIntegration, Method, PassthroughBehavior, Resource, RestApi} from "@aws-cdk/aws-apigateway";
import {NodejsFunction, NodejsFunctionProps} from "@aws-cdk/aws-lambda-nodejs";
import {IFunction, Runtime} from "@aws-cdk/aws-lambda";
import {MethodOptions} from "@aws-cdk/aws-apigateway/lib/method";

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

    addMethod(resource: Resource, handler: IFunction, httpMethod: string, options?: MethodOptions) {
        this.methods.push(
            resource.addMethod(
                httpMethod,
                new LambdaIntegration(handler,
                    {
                        proxy: false,
                        passthroughBehavior: PassthroughBehavior.NEVER,
                        requestTemplates: {
                            'application/json': requestMapper
                        }
                    }),
                options)
        )
    }
}