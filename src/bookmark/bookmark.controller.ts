import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookMarkService: BookmarkService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createBookmark(
    @Body() dto: CreateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    return this.bookMarkService.createBookmark(userId, dto);
  }

  @Get('')
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookMarkService.getBookmarks(userId);
  }

  @Get('/:id')
  getBookmarkById(@Param('id', ParseIntPipe) id: number) {
    return this.bookMarkService.getBookmarkById(id);
  }

  @Patch('/:id')
  editBookmarkById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    return this.bookMarkService.editBookmarkById(id, dto, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  deleteBookmarkById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookMarkService.deleteBookmarkById(id, userId);
  }
}
