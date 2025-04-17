import { SetMetadata } from "@nestjs/common"
import { UserRole } from "generated/prisma"

export const ROLES_KEY = 'roles'

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)

/*
Это декоратор, который принимает один или несколько параметров, представляющих роли пользователя (в этом примере тип UserRole), и сохраняет их в метаданных.

SetMetadata — это функция NestJS, которая добавляет данные в метаданные для метода или класса. В данном случае мы сохраняем роли под ключом ROLES_KEY.
*/