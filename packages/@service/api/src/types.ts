import { ApiGatewayService } from '@gateway/definition';
import { HandlerContext, ServiceImpl } from '@bufbuild/connect';
import { AnyMessage } from '@bufbuild/protobuf';

export type ApiGatewayService = typeof ApiGatewayService;
export type ServiceImplementation = ServiceImpl<typeof ApiGatewayService>;
export type MethodImplementation = Partial<ServiceImplementation>;
export type Method = keyof MethodImplementation;

export type Middleware = (
  request: AnyMessage | AsyncIterable<AnyMessage>,
  context: HandlerContext
) => Promise<void>;

export interface Route {
  middleware: Middleware[];
  method: Method;
  implementation: MethodImplementation;
}

export interface Connection {
  socketIdsByFlowInternal: Map<string, Set<string>>;
  socketIds: Set<string>;
}
