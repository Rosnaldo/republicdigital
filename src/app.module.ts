import { Module } from '@nestjs/common'
import { UserModule } from './module/user/user.module'
import { BcryptService } from './service/bcrypt.service'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.ENV !== 'prod' ? 'trace' : 'info'
      }
    }), 
    ConfigModule.forRoot(),
    UserModule
  ],
  controllers: [],
  providers: [BcryptService],
})
export class AppModule {}
