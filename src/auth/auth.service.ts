import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/models/user.model';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    try {
      // generate the password hash
      const password = await argon.hash(createAuthDto.password);
      const user = new this.userModel({ email: createAuthDto.email, password });
      const createdUser = await user.save();
      return this.signToken(createdUser._id, user.email);
    } catch (error) {
      // Check if the error is a duplicate key violation based on the error message
      if (error.message.includes('duplicate key error')) {
        // Duplicate key violation
        throw new ForbiddenException('User with this email already exists.');
      } else {
        // Some other error occurred
        console.error('Error creating user:', error);
        throw new ForbiddenException('Error creating user.');
      }
    }
  }

  async login(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.userModel.findOne({ email: createAuthDto.email });
      // if user does not exist throw exception
      if (!user) throw new ForbiddenException('Credentials incorrect');

      const pwMatches = await argon.verify(user.password, createAuthDto.password);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
      return this.signToken(user._id, user.email);
    } catch (error) {
      throw new ForbiddenException('Error while login');
    }
  }

  async handleGoogleLogin(req: any) {
    // console.log(req);
  }

  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
