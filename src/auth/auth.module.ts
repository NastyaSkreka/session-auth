import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getProvidersConfig } from 'src/config/providers.config';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: getProvidersConfig, 
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
