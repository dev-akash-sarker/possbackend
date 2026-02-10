import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Admin } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async checkAdminExists(): Promise<boolean> {
    const count = await this.prisma.admin.count();
    return count > 0;
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
  }

  async adminsignup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<Admin> {
    // 1. Check if ANY admin already exists
    const adminCount = await this.prisma.admin.count();
    if (adminCount > 0) {
      throw new ConflictException(
        'An admin already exists. Only one admin is allowed.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    console.log('hello world i am  ----', isPasswordMatch);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
    } catch (e) {
      console.error('UPDATE ERROR:', e);
    }
    return {
      accessToken,
      refreshToken,
    };
  }
  async adminlogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      admin.password,
    );
    console.log('hello world i am  ----', isPasswordMatch);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    try {
      await this.prisma.admin.update({
        where: { id: admin.id },
        data: { refreshToken },
      });
    } catch (e) {
      console.error('UPDATE ERROR:', e);
    }
    return {
      accessToken,
      refreshToken,
    };
  }
}
