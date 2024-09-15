import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BonusesModule } from './bonuses/bonuses.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CONFIG_MONGODB } from './config/app-config';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${CONFIG_MONGODB.IP}:${CONFIG_MONGODB.PORT}/${CONFIG_MONGODB.DB}`),
    UsersModule, 
    BonusesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
