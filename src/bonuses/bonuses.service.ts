import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBonusDto, UpdateBonusDto } from './dto/bonuses.dto';
import { Bonus, BonusDocument } from './schemas/bonuses.schema.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BonusesService {
    private readonly THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

    constructor(
        @InjectModel(Bonus.name) private bonusModel: Model<BonusDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async create(dto: CreateBonusDto): Promise<Bonus> {
        const createdBonus = new this.bonusModel({
            id: uuidv4(),
            ...dto 
        });
        return createdBonus.save();
    }
  
    async findAll() {
        const cachedBonuses = await this.cacheManager.get<Bonus[]>('allBonuses');
        if (cachedBonuses) {
            return cachedBonuses;
        }
        const bonuses = await this.bonusModel.find().exec();
        await this.cacheManager.set('allBonuses', bonuses);
        return bonuses;
    }
  
    async findOne(id: string) {
        const bonus = await this.bonusModel.findById(id).exec();
        if (!bonus) {
          throw new NotFoundException(`Bonus with ID ${id} not found`);
        }
        return bonus;
    }
  
    async update(id: string, dto: UpdateBonusDto) {
        const bonus = await this.bonusModel.findById(id).exec();
        if (!bonus) {
            throw new NotFoundException(`Bonus with ID ${id} not found`);
        }
        Object.keys(dto).forEach(key => {
            bonus[key] = dto[key];
        });
        return bonus.save();
    }
  
    async remove(id: string) {
        const bonus = await this.bonusModel.findByIdAndDelete(id).exec();
        if (!bonus) {
          throw new NotFoundException(`Bonus with ID ${id} not found`);
        }
        return true;
    }

    async getRandomBonusForUser(userId: string): Promise<Bonus> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        if (user.lastScroll && !this.isThreeDaysPassed(user.lastScroll)) {
          throw new BadRequestException('Вы можете крутить барабан раз в 3 дня!');
        }
        const bonuses = await this.findAll();
        if (!bonuses || bonuses.length === 0) {
          throw new NotFoundException('No bonuses available');
        }
        const randomBonus = this.getRandomBonus(bonuses, user.isInfluencer);
        user.lastScroll = new Date();
        await user.save();
        return randomBonus;
    }

    private isThreeDaysPassed(lastBonusReceived: Date): boolean {
        const now = Date.now();
        const lastBonusTime = new Date(lastBonusReceived).getTime();
        return now - lastBonusTime > this.THREE_DAYS_IN_MS;
    }
    
    private getRandomBonus(bonuses: Bonus[], isInfluencer: boolean): Bonus {
        const totalWeight = bonuses.reduce((sum, bonus) => {
            const adjustedDropChance = isInfluencer && bonus.chance < 5 ? bonus.chance + 1 : bonus.chance;
            return sum + adjustedDropChance;
        }, 0);
        const random = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (const bonus of bonuses) {
            const adjustedDropChance = isInfluencer && bonus.chance < 5 ? bonus.chance + 1 : bonus.chance;
            cumulativeWeight += adjustedDropChance;
            if (random < cumulativeWeight) {
                return bonus;
            }
        }
        return bonuses[bonuses.length - 1];
    }
}
