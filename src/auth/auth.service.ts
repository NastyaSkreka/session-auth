import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { Request, Response } from 'express';
import { AuthMethod, User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
   public constructor(private readonly userService: UserService, 
    private readonly configService: ConfigService
   ) {}

    public async register(req: Request, dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if (isExists) {
            throw new ConflictException(
                'Регистрация не удалась. Пользователь с таким email уже существует.'
            )
        }

        const newUser = await this.userService.create(
            dto.email, 
            dto.password, 
            dto.name, 
            '', 
            AuthMethod.CREDENTIALS, 
            false
        )

        return this.saveSession(req, newUser)
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)

        if (!user || !user.password) {
            throw new NotFoundException('Пользователь не найден.')
        }

        const isValidPassword = await verify(user.password, dto.password)

        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный пароль.')
        }

        return this.saveSession(req, user)

    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось завершить сессию.'
                        )
                    )
                }

                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
                resolve()
            })

           
        })
    }

    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию.'
                        )
                    )
                }
            })

            resolve({
                user
            })
        })
    }
}
