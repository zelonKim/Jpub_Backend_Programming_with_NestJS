import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }


    private validateRequest(request: any) {
        const jwtString = request.headers.authorization.split('Bearer ')[1]; // 헤더에 JWT를 파싱함. / Bearer 방식 인증을 사용함.
        this.authService.verify(jwtString); // JWT가 서버에서 발급한 것인지 검증함.
        return true;
    }
}

