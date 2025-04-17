import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/*
Этот guard проверяет, есть ли у пользователя роль, которая разрешена для доступа к текущему ресурсу. Если роли не совпадают, выбрасывается ошибка доступа.
 */

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
    ]);

    /*
    Здесь this.reflector.getAllAndOverride() извлекает роли из метаданных, которые были установлены с помощью декоратора @Roles() (он использует ключ ROLES_KEY). То есть, этот код ищет метаданные для текущего класса (или метода), чтобы узнать, какие роли разрешены для доступа.
    */

    const request = context.switchToHttp().getRequest();

    if (!roles) return true;

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        'Недостаточно прав. У вас нет прав доступа к этому ресурсу.',
      );
    }

    return true;
  }
}
/*
CanActivate: Это интерфейс, который должен быть реализован, чтобы создать guard, проверяющий доступ. Метод canActivate будет вызываться перед тем, как обработчик маршрута (метод контроллера) выполнится.

ExecutionContext: Это объект, который содержит информацию о текущем запросе и контексте, в котором происходит вызов.

Reflector: Это служебный класс, который позволяет извлекать метаданные, установленные с помощью декораторов.

*/
