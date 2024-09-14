import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateBalanceDto, UpdateUserDto } from './dto/users.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    @ApiOperation({ summary: 'Получить всех пользователей' })
    findAll() {
        return this.usersService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiParam({ name: 'id', description: 'ID пользователя' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Создать пользователя' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Изменить пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Patch(':id/increase-balance')
    @ApiOperation({ summary: 'Увеличить баланс пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя' })
    increaseBalance(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
      return this.usersService.increaseBalance(id, dto);
    }
  
    @Patch(':id/decrease-balance')
    @ApiOperation({ summary: 'Уменьшить баланс пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя' })
    decreaseBalance(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
      return this.usersService.decreaseBalance(id, dto);
    }
}
