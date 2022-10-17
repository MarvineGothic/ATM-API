import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/AppModule';
import { Denomination } from '../../src/atm/provider/AtmProviderInterface';
import { AtmRepository } from '../../src/atm/repository/AtmRepository';

type GenerateResponseCommand = {
  thousand?: number,
  fiveHundred?: number,
  twoHundred?: number,
  oneHundred?: number,
  fifty?: number,
  twenty?: number,
  ten?: number,
  five?: number,
  two?: number,
  one?: number,
}

describe('ATM', () => {
  let app: INestApplication;
  let agent: request.SuperTest<request.Test>;
  let atmRepository: AtmRepository;
  let atmId: string = 'atm_1';

  const fullAmount = {
    thousand: 1,
    fiveHundred: 2,
    twoHundred: 5,
    oneHundred: 10,
    fifty: 20,
    twenty: 50,
    ten: 100,
    five: 200,
    two: 500,
    one: 1000,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    agent = request(app.getHttpServer());
    atmRepository = moduleFixture.get<AtmRepository>(AtmRepository);
  });

  afterAll(async () => {
    await app.close();
  });
  
  const fillDB = async () => {
    await atmRepository.upsert({
      tx: null,
      model: {
        atmId,
        ...fullAmount,
      }
    });
  }

  describe('atm/refill', () => {
    it.each([
      [500, { atmId, denomination: Denomination.FIVEHUNDRED, amount: 2 }],
      [200, { atmId, denomination: Denomination.TWOHUNDRED, amount: 5 }],
      [100, { atmId, denomination: Denomination.ONEHUNDRED, amount: 10 }],
      [50, { atmId, denomination: Denomination.FIFTY, amount: 20 }],
      [20, { atmId, denomination: Denomination.TWENTY, amount: 50 }],
      [10, { atmId, denomination: Denomination.TEN, amount: 100 }],
      [5, { atmId, denomination: Denomination.FIVE, amount: 200 }],
      [2, { atmId, denomination: Denomination.TWO, amount: 500 }],
      [1, { atmId, denomination: Denomination.ONE, amount: 1000 }],
    ])('Should refill %s', async (_, payload) => {
      return await agent
        .post('/atm/refill')
        .send(payload)
        .expect(201);
    });
  });

  describe('atm/withdraw', () => {
    beforeEach(async () => {
      await fillDB();
    });

    it.each([
      [10000, fullAmount],
      [5555, { thousand: 1, fiveHundred: 2, twoHundred: 5, oneHundred: 10, fifty: 20, twenty: 27, ten: 1, five: 1 }],
      [1953, { thousand: 1, fiveHundred: 1, twoHundred: 2, fifty: 1, two: 1, one: 1 }],
      [1000, { thousand: 1 }],
      [500, { fiveHundred: 1 }],
      [200, { twoHundred: 1 }],
      [100, { oneHundred: 1 }],
      [50, { fifty: 1 }],
      [20, { twenty: 1 }],
      [10, { ten: 1 }],
      [5, { five: 1 }],
      [2, { two: 1 }],
      [1, { one: 1 }],
    ])('Should withdraw %s', async (amount, payload) => {      
      return await agent
        .post('/atm/withdraw')
        .send({
          atmId,
          amount,
        })
        .expect(200)
        .expect(generateResponse(payload));
    });

    it('should try to withdraw 10001 but throw exception \'There\'s not enough money in ATM. Try another amount\'', async () => {
      return await agent
        .post('/atm/withdraw')
        .send({
          atmId,
          amount: 10001,
        })
        .expect(400)
        .expect({ message: 'There\'s not enough money in ATM. Try another amount' });
    });

    it('should withdraw all amount and then reject', async () => {
      await agent
        .post('/atm/withdraw')
        .send({ atmId, amount: 10000 })
        .expect(200)
        .expect(generateResponse(fullAmount));
      return await agent
        .post('/atm/withdraw')
        .send({ atmId, amount: 1 })
        .expect(400)
        .expect({ message: 'There\'s not enough money in ATM. Try another amount' });
    })
  })
});

function generateResponse(command: GenerateResponseCommand) {
  return {
    notes: {
      thousand: command.thousand ?? 0,
      fiveHundred: command.fiveHundred ?? 0,
      twoHundred: command.twoHundred ?? 0,
      oneHundred: command.oneHundred ?? 0,
      fifty: command.fifty ?? 0,
    },
    coins: {
      gtTwentyMm: {
        twenty: command.twenty ?? 0,
        five: command.five ?? 0,
        two: command.two ?? 0,
      },
      leTwentyMm: {
        ten: command.ten ?? 0,
        one: command.one ?? 0,
      }
    }
  }
}

