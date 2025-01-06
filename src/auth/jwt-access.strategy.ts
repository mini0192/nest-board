import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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