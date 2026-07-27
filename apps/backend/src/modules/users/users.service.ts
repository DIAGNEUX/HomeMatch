import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const user = await this.userRepository.update(id, updateUserDto);
    const { password, ...safeUser } = user;

    return safeUser;
  }
}
