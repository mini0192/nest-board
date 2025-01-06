import { Controller, Post, Body, Res, ForbiddenException, UseGuards, Request } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthData } from './dto/auth-data.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authsService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  async create(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user: User = await this.userService.findOne(loginDto.username);
    if(!user) {
      throw new ForbiddenException("아이디를 찾을 수 없습니다.");
    }

    const isAuth = await bcrypt.compare(loginDto.password, user.password);
    if(!isAuth) {
      throw new ForbiddenException("비밀번호가 일치하지 않습니다.");
    }

    const jwtToken: string = this.authsService.getRefreshToken({ user });
    const refreshToken: string = this.authsService.getAccessToken({ user });

    this.setJwtHeader(res, jwtToken);
    this.setRefreshCookie(res, refreshToken);
    
    return res.send();
  }

  @UseGuards(AuthGuard("refresh"))
  @Post('refresh')
  restoreAccessToken(@Request() req, @Res() res: Response) {
    const auth: AuthData = req.user;
    const jwtToken: string = this.authsService.getAccessToken({ user: auth });

    this.setJwtHeader(res, jwtToken);
    
    return res.send();
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie("refresh", token, { httpOnly: true, secure: false });
  }

  private setJwtHeader(res: Response, token: string) {
    res.header("Authorization", `Bearer ${token}`);
  }
}
