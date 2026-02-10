import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin, User } from '../generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('admin-exists')
  async checkAdminExists() {
    // Call the service method instead of this.prisma
    const exists = await this.authService.checkAdminExists();
    return { exists };
  }
  @Post('register')
  async signupUser(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<User> {
    const { firstName, lastName, email, password } = body;
    return this.authService.register(firstName, lastName, email, password);
  }
  @Post('admin/signup')
  async Signupadmin(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<Admin> {
    const { firstName, lastName, email, password } = body;
    return this.authService.adminsignup(firstName, lastName, email, password);
  }
  @Post('signin')
  async signinUser(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
  @Post('admin/signin')
  async signinAdmin(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = body;
    return this.authService.adminlogin(email, password);
  }
}
