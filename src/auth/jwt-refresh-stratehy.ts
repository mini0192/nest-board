import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                const cookie: string = req.cookies["refresh"];
                return cookie;
            },
            secretOrKey: process.env.JWT_KEY,
        })
    }

    validate(payload) {
        return {
            username: payload.username,
            id: payload.id,
        }
    }
}