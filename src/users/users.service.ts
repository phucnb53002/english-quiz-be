import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hashedPassword });
    return await user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password')
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashed: string | null = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashed,
    });
  }
}
