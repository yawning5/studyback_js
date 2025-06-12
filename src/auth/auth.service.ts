import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // 로그인
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const pwMatch = await bcrypt.compare(password, user.password);
        if (!pwMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return user;
    }

    // JWT 토큰 생성
    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = {  sub: user.id, email: user.email,};
        return {
            access_token: this.jwtService.sign(payload),
            user: {id: user.id, email: user.email},
        };
    }
        
}
