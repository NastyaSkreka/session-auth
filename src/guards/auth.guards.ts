import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

// проверяет, авторизован ли пользователь, перед тем как дать доступ к определенному маршруту.

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    /*Здесь мы получаем объект запроса. Это нужно для того, чтобы извлечь информацию о пользователе, которая хранится в сессии (например, userId). */

    if (typeof request.session.userId === 'undefined') {
        throw new UnauthorizedException(
            'Пользователь не авторизован.'
        )
    }

    const user = await this.userService.findById(request.session.userId)

    request.user = user

    return true;
  }
}

/*
CanActivate: Интерфейс, который должен быть реализован в guard. Метод canActivate используется для определения, разрешен ли доступ к маршруту.

ExecutionContext: Это объект, который содержит информацию о текущем запросе, контексте, в котором происходит вызов.
*/