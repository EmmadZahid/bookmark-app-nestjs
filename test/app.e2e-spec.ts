import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto/auth.dto';

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
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200)
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

  describe('User', ()=>{})

  describe('Bookmark', ()=>{})
});
