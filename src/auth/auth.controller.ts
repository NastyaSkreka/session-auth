import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthProviderGuard } from 'src/guards/provider.guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProviderService } from './provider/provider.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, 
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService
  ) {}
  
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register( @Req() req: Request,@Body() dto: RegisterDto) {
      return this.authService.register(req, dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login( @Req() req: Request,@Body() dto: LoginDto) {
      return this.authService.login(req, dto)
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider)

    return {
      url: providerInstance?.getAuthUrl()
    }
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() req: Request, 
    @Res({passthrough: true}) res: Response,
    @Query('code') code: string, 
    @Param('provider') provider: string
  ) {
    if (!code) {
      throw new BadRequestException(
        'Не был предоставлен код авторизации'
      )
    }

    await this.authService.extractProfileFromCode(req, provider, code)

    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
    )
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout( @Req() req: Request,
  @Res({passthrough: true }) res: Response
) {
      return this.authService.logout(req, res)
  }
}