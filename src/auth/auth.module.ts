import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { UserModule } from 'src/api/user/user.module';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_EXP}s` },
    }),
    JwtModule.register({
      secret: process.env.REFRESH_TOKEN_KEY,
      signOptions: { expiresIn: `${process.env.REFRESH_TOKEN_EXP}s` },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
