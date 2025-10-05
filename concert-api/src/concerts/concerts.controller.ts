import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('admin/concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.concertsService.create(dto);
  }

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.concertsService.remove(id);
  }

  @Get('stats')
  stats() {
    return this.concertsService.stats();
  }
}
