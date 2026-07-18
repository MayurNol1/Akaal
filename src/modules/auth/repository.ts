import prisma from "@/lib/prisma";
import { RegisterInput } from "./validation";
import { Role } from "@prisma/client";

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async updateProfile(
    id: string,
    data: { name?: string; emailNotifications?: boolean; privacyMode?: boolean }
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        emailNotifications: true,
        privacyMode: true,
      },
    });
  }

  static async updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: { id: true },
    });
  }

  static async replacePasswordResetToken(identifier: string, tokenHash: string, expires: Date) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return prisma.verificationToken.create({
      data: { identifier, token: tokenHash, expires },
    });
  }

  static async findPasswordResetToken(identifier: string, tokenHash: string) {
    return prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token: tokenHash } },
    });
  }

  static async deletePasswordResetTokens(identifier: string) {
    return prisma.verificationToken.deleteMany({ where: { identifier } });
  }

  static async createUser(data: RegisterInput & { password: string; role?: Role }) {
    return prisma.user.create({
      data: {
        ...data,
        role: data.role || Role.USER,
      },
    });
  }
}
