import { BadGatewayException, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";


export class ErrosInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(catchError(err => throwError(() => new BadGatewayException())),
        )
    }    
} // 모든 에러를 잡아서 BadGatewayException으로 변환함.
