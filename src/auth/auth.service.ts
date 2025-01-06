import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthData } from './dto/auth-data.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  private key: string = process.env.JWT_KEY;

  getAccessToken({ user }): string {
    const payload: AuthData = {
      username: user.username,
      id: user.id
    };
    return this.jwtService.sign(
      payload,
      {
        secret: this.key,
        expiresIn: '5m'
      }
    );
  }

  getRefreshToken({ user }): string {
    const payload: AuthData = {
      username: user.username,
      id: user.id
    };
    return this.jwtService.sign(
      payload,
      {
        secret: this.key,
        expiresIn: '5m'
      }
    );
  }
}
