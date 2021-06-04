import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenService } from '../services/token.service'

export interface TokenJwt {
  id: number,
  atgAppClientId?: number,
  email: string,
  person: object,
  iat?: Date
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_KEY')
    });
  }

  validate(token: TokenJwt) {
    return this.tokenService.validateToken(token);
  }
}