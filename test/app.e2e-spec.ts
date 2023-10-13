import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('AppController (e2e)', () => {
  let app:INestApplication
  let prisma:PrismaService
  let port:number = 3333

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    //We have to add pipe here in tests, the same way we add in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true //Trims any extra property sent from client in request object
    }))

    app.init()
    app.listen(port)
    prisma = app.get(PrismaService)
    await prisma.cleanDb()

    pactum.request.setBaseUrl(`http://localhost:${port}`)
  });

  //tear down
  afterAll(() => {
    app.close()
  })

  describe('Auth', ()=>{
    let dto:AuthDto = new AuthDto()
    dto.email = "emmad@gmail.com"
    dto.password = "123"

    describe('Signup', ()=>{
      it('should signup', () =>{
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })

      it('should signup second user', () =>{
        let dto2:AuthDto = new AuthDto()
        dto2.email = "emmad2@gmail.com"
        dto2.password = "1234"
        return pactum.spec().post('/auth/signup').withBody(dto2).expectStatus(201).stores('user2AccessToken','access_token')
      })

      it('should throw if email is empty', () =>{
        return pactum.spec().post('/auth/signup').withBody({
          email: dto.email
        }).expectStatus(400)
      })

      it('should throw with no email', () =>{
        return pactum.spec().post('/auth/signup').withBody({
          password: dto.password
        }).expectStatus(400)
      })

      it('should throw with invalid email', () =>{
        return pactum.spec().post('/auth/signup').withBody({
          ...dto, email: "wrongemail@"
        }).expectStatus(400)
      })
    })


    describe('Signin', ()=>{
      it('should signin', () =>{
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAccessToken','access_token')
      })

      it('should throw if email is empty', () =>{
        return pactum.spec().post('/auth/signin').withBody({
          email: dto.email
        }).expectStatus(400)
      })

      it('should throw with no email', () =>{
        return pactum.spec().post('/auth/signin').withBody({
          password: dto.password
        }).expectStatus(400)
      })

      it('should throw with invalid email', () =>{
        return pactum.spec().post('/auth/signin').withBody({
          ...dto, email: "wrongemail@"
        }).expectStatus(400)
      })

      it('should throw with wrong password', () =>{
        return pactum.spec().post('/auth/signin').withBody({
          ...dto, password: "wrong pass"
        }).expectStatus(400)
      })

      it('should throw with wrong email', () =>{
        return pactum.spec().post('/auth/signin').withBody({
          ...dto, email: "wrong email"
        }).expectStatus(400)
      })
    })
  })

  describe('User', () => {
    it('should get current user', () => {
      return pactum.spec().get('/users/me').withHeaders({
        Authorization: 'Bearer $S{userAccessToken}'
      }).expectStatus(200).stores('userId','id') //.inspect()
    })

    it('should throw if token is invalid', () => {
      return pactum.spec().get('/users/me').withHeaders({
        Authorization: 'Bearer $S{userAccessToken}Someinvalid string'
      }).expectStatus(401)
    })

    it('should throw if token is not present', () => {
      return pactum.spec().get('/users/me').expectStatus(401)
    })

    it('should edit', () => {
      const dto:EditUserDto = new EditUserDto()
      dto.firstName = "Emmad88"
      dto.lastName = "Zahid88"
      return pactum
        .spec()
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}'
        })
        .patch('/users/edit/$S{userId}')
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.lastName)
    })

    it('should throw if logged in user is different', () => {
      const dto:EditUserDto = new EditUserDto()
      dto.firstName = "Emmad88"
      dto.lastName = "Zahid88"
      return pactum
        .spec()
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}'
        })
        .patch('/users/edit/$S{userId}1')
        .expectStatus(403)
    })

    // it('should throw if all fields are empty', () => {
    //   const dto:EditUserDto = new EditUserDto()
    //   dto.firstName = ""
    //   dto.lastName = ""
    //   return pactum
    //     .spec()
    //     .withBody(dto)
    //     .withHeaders({
    //       Authorization: 'Bearer $S{userAccessToken}'
    //     })
    //     .patch('/users/edit/$S{userId}')
    //     .expectStatus(400)
    //     .inspect()
    // })


  })

  describe('Bookmark', ()=>{
    it('should create bookmark', () => {
      const dto:CreateBookmarkDto = new CreateBookmarkDto()
      dto.title = "Angular title"
      dto.description = "Some description"
      dto.link = "https://angular.io"
      
      return pactum
      .spec()
      .withBody(dto)
      .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}'
      })
      .post('/bookmarks')
      .expectStatus(201)
      .stores('bookmarkId', 'id')
    })

    it('should get bookmarks by id', () =>{
      return pactum
        .spec()
        .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
        })
        .get('/bookmarks/$S{bookmarkId}')
        .expectStatus(200)
    })

    it('should get bookmarks', () =>{
      return pactum
        .spec()
        .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
        })
        .get('/bookmarks')
        .expectStatus(200)
        .expectJsonLength(1)
    })

    it('should update bookmark by id', () =>{
      const dto:EditBookmarkDto = new EditBookmarkDto()
      dto.title = "Angular title(updated)"
      dto.description = "Some description(updated)"
      dto.link = "https://angular.io/home"
      
      return pactum
      .spec()
      .withBody(dto)
      .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}'
      })
      .patch('/bookmarks/$S{bookmarkId}')
      .expectStatus(200)
      .expectBodyContains(dto.title)
      .expectBodyContains(dto.description)
      .expectBodyContains(dto.link)
    })

    it('should throw if other user tries to update the bookmark', () =>{
      const dto:EditBookmarkDto = new EditBookmarkDto()
      dto.title = "Angular title(updated)"
      dto.description = "Some description(updated)"
      dto.link = "https://angular.io/home"
      
      return pactum
      .spec()
      .withBody(dto)
      .withHeaders({
          Authorization: 'Bearer $S{user2AccessToken}'
      })
      .patch('/bookmarks/$S{bookmarkId}')
      .expectStatus(403)
    })

    it('should throw if other user tries to delete the bookmark', () =>{
      return pactum
        .spec()
        .withHeaders({
            Authorization: 'Bearer $S{user2AccessToken}'
        })
        .delete('/bookmarks/$S{bookmarkId}')
        .expectStatus(403)
    })

    it('should delete bookmark by id', () =>{
      return pactum
        .spec()
        .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
        })
        .delete('/bookmarks/$S{bookmarkId}')
        .expectStatus(204)
    })

    it('should throw if bookmark not found on delete', () =>{
      return pactum
        .spec()
        .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
        })
        .delete('/bookmarks/$S{bookmarkId}')
        .expectStatus(404)
    })
  })
});
