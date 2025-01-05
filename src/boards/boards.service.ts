import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board: Board = Object.assign(new Board(), {
      title: createBoardDto.title,
      content: createBoardDto.content
    });
    return await this.boardRepository.save(board);
  }

  async findAll(): Promise<Board[]>{
    return this.boardRepository.find();
  }

  async findOne(id: number): Promise<Board> {
    return this.boardRepository.findOneBy({ id });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board: Board = await this.boardRepository.findOneBy({ id });
    if(!board) {
      throw new Error(`Board with id ${id} not found`);
    }

    Object.assign(board, {
      title: updateBoardDto.title,
      content: updateBoardDto.content
    });

    return await this.boardRepository.save(board);
  }

  async remove(id: number): Promise<void> {
    await this.boardRepository.delete(id);
  }
}
