import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "generated/prisma";
import { AuthGuard } from "../guards/auth.guards";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";

/*
Этот декоратор комбинирует логику авторизации и проверки ролей в одном месте.

Он позволяет использовать один декоратор для применения как проверки авторизации (AuthGuard), так и проверки ролей пользователя (RolesGuard).

Если роли переданы, проверяется, что пользователь авторизован и имеет одну из указанных ролей. Если роли не переданы, проверяется только авторизация.
*/

export function Authorization(...roles: UserRole[]) {
    if (roles.length > 0) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(AuthGuard, RolesGuard)
        )
    }

    return applyDecorators(UseGuards(AuthGuard))
}

/*
applyDecorators:Это утилита из NestJS, которая позволяет комбинировать несколько декораторов и применить их к методу или классу. Она позволяет нам объединить декораторы в одном месте, чтобы избежать дублирования кода и упростить использование.
*/