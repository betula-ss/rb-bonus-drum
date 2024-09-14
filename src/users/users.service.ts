import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdateBalanceDto, UpdateUserDto } from './dto/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(dto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel({
            _id: uuidv4(),
            isInfluencer: false,
            lastScroll: null,
            balance: 0,
            ...dto 
        });
        return createdUser.save();
    }
  
    async findAll() {
        return this.userModel.find().exec();
    }
  
    async findOne(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
  
    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        Object.keys(dto).forEach(key => {
            user[key] = dto[key];
        });
        return user.save();
    }
  
    async remove(id: string) {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }

    async increaseBalance(id: string, dto: UpdateBalanceDto) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        user.balance += dto.amount;
        if (dto.amount >= 300) {
            user.lastScroll = null;
        }
        return user.save();
    }
  
    async decreaseBalance(id: string, dto: UpdateBalanceDto) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (user.balance < dto.amount) {
            throw new BadRequestException('Баланс не может быть меньше 0');
        }
        user.balance -= dto.amount;
        return user.save();
    }
}
