import { Module } from '@nestjs/common';
import { BonusesController } from './bonuses.controller';
import { BonusesService } from './bonuses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bonus, BonusSchema } from './schemas/bonuses.schema.dto';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { CONFIG_REDIS } from 'src/config/app-config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bonus.name, schema: BonusSchema }]),
    CacheModule.register({
      store: redisStore,
      host: CONFIG_REDIS.HOST,
      port: CONFIG_REDIS.PORT,
      ttl: CONFIG_REDIS.TTL
    }),
    UsersModule
  ],
  controllers: [BonusesController],
  providers: [BonusesService]
})
export class BonusesModule {}
