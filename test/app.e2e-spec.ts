import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing'
import { AppModule } from '../src/app.module';
describe('AppController (e2e)', () => {
  let app:INestApplication

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
  });

  //tear down
  afterAll(() => {
    app.close()
  })

  it.todo('shoud work')
});
