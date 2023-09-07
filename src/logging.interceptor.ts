import { ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0); // 실행 콘텍스트에 포함된 첫번째 객체인 요청 정보를 얻어옴.
    this.logger.log(`Request to ${method} ${url}`); // 로그로 요청의 HTTP메서드와 URL을 출력함.

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
            )}`,
          ),
        ),
      );
  } //  응답결과를 HTTP메서드와 URL과 함께 출력함.
}
