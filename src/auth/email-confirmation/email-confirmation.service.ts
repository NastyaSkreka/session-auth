import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { TokenType, User } from 'generated/prisma';
import { MailService } from 'src/libs/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth.service';
import { ConfirmationDto } from './dto/confirmation.dto';

@Injectable()
export class EmailConfirmationService {
    public constructor(private readonly prismaService: PrismaService, 
     private readonly mailService: MailService, 
     private readonly userService: UserService,
     @Inject(forwardRef(() => AuthService))
     private readonly authService: AuthService
    ) {}

    public async newVerification(req: Request, dto: ConfirmationDto) {
        console.log("dto =>", dto)
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: dto.token, 
                type: TokenType.VERIFICATION
            }
        })

        if (!existingToken) {
            throw new NotFoundException(
                'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
            )
        }

        const hasExpires = new Date(existingToken.expiresIn) < new Date()

        if (hasExpires) {
            throw new BadRequestException(
                'Токен подтверждения истек.Пожалуйста, запросите новый токен для потверждения.'

            )
        }

        const existingUser = await this.userService.findByEmail(existingToken.email)

        console.log("existingUser =>", existingUser)

        if (!existingUser) {
            throw new NotFoundException(
                'Пользователь не найден.'
            )
        }

        await this.prismaService.user.update({
            where: {
                id: existingUser.id
            }, 
            data: {
                isVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION
            }
        })

        return this.authService.saveSession(req, existingUser)
    }

    public async sendVerificationToken(user: User) {
        const verificationToken = await this.generateVerificationToken(user.email)
    
        await this.mailService.sendConfirmationEmail(
            verificationToken.email,
            verificationToken.token
          )
          
        return true
    }

    private async generateVerificationToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)
    
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email, 
                type: TokenType.VERIFICATION
            }
        })
     
        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION,
                },
            });
        }
        
        
       
        const verificationToken = await this.prismaService.token.create({
            data: {
                email, 
                token, 
                expiresIn, 
                type: TokenType.VERIFICATION
            }
        })

        return verificationToken;
    }
}



