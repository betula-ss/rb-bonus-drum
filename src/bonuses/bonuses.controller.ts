import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { CreateBonusDto, UpdateBonusDto } from './dto/bonuses.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('bonuses')
@Controller('bonuses')
export class BonusesController {
    constructor(private readonly bonusesService: BonusesService) {}
  
    @Get()
    @ApiOperation({ summary: 'Получить все бонусы' })
    findAll() {
        return this.bonusesService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Получить бонус по ID' })
    @ApiParam({ name: 'id', description: 'ID бонуса' })
    findOne(@Param('id') id: string) {
        return this.bonusesService.findOne(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Создать бонус' })
    create(@Body() dto: CreateBonusDto) {
        return this.bonusesService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Изменить бонус' })
    @ApiParam({ name: 'id', description: 'ID бонуса' })
    update(@Param('id') id: string, @Body() dto: UpdateBonusDto) {
        return this.bonusesService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить бонус' })
    @ApiParam({ name: 'id', description: 'ID бонуса' })
    remove(@Param('id') id: string) {
        return this.bonusesService.remove(id);
    }

    @Get('random/:userId')
    @ApiOperation({ summary: 'Крутить барабан' })
    @ApiParam({ name: 'userId', description: 'ID пользователя' })
    getRandomBonusForUser(@Param('userId') userId: string) {
        try {
            return this.bonusesService.getRandomBonusForUser(userId);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('An error occurred while retrieving the bonus.');
        }
    }
}
