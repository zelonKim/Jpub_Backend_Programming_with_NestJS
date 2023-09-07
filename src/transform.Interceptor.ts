import { ExecutionContext, NestInterceptor } from "@nestjs/common";


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(data => {
            return { data } // 라우터 핸들러에서 전달한 응답을 객체로 감싸서 변형함.
        }))
    }
}