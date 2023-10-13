import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService){}

    async createBookmark(userId:number, dto:CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data:{
                ...dto,
                userId
            }
        })

        return bookmark
    }

    async getBookmarks(userId:number) {
        return await this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

   async getBookmarkById(id:number){
       const bookmark = await this.prisma.bookmark.findUnique({
           where:{
               id
           }
       })

       return bookmark
   }

   async editBookmarkById(id:number, dto:EditBookmarkDto, userId:number){
        let bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: id
            }
        })

        if(!bookmark || bookmark.userId != userId){
            throw new ForbiddenException("You dont have permission to delete it")
        }

        bookmark = await this.prisma.bookmark.update({
            where:{
                id
            },
            data:{
                ...dto
            }
        })

        return bookmark
    }

    async deleteBookmarkById(bookmarkId:number, userId:number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: bookmarkId
            }
        })

        if(!bookmark){
            throw new NotFoundException("Bookmark not found")
        }

        if(bookmark.userId != userId){
            throw new ForbiddenException("You dont have permission to delete it")
        }


        await this.prisma.bookmark.delete({
            where:{
                id: bookmarkId
            }
        })
    }
}
