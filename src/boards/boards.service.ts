import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { AuthData } from 'src/auth/dto/auth-data.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createBoardDto: CreateBoardDto, auth: AuthData): Promise<Board> {
    const user: User = await this.userRepository.findOneBy({ id: auth.id });

    const board: Board = Object.assign(new Board(), {
      title: createBoardDto.title,
      content: createBoardDto.content,
      user: user
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
