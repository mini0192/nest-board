import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthData } from 'src/auth/dto/auth-data.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard("access"))
  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    const auth: AuthData = req.user;
    return this.boardsService.create(createBoardDto, auth);
  }

  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(+id);
  }

  @UseGuards(AuthGuard("access"))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  @UseGuards(AuthGuard("access"))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}
