import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus, UseFilters, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { ApiTags } from '@nestjs/swagger';
import { AppLogger } from 'src/logger/logger.service';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {}

  @Post('register')
  @UseFilters(new HttpExceptionFilter())
  register(@Body() createAuthDto: CreateAuthDto) {
    try {
      return this.authService.register(createAuthDto);
    } catch (error) {
      this.logger.requestError(error.message);
      // Handle the error
      return { message: 'Something went wrong please try again later or contact support' };
    }
  }

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // Handle the Google authentication callback
    return this.authService.handleGoogleLogin(req);
  }
}
