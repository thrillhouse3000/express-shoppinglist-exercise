process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

let item1 = {"name": "popsicle", "price": 1.45};
let item2 = {"name": "bread", "price": 1.5};

beforeEach(() => {
    items.push(item1);
});

afterEach(() => {
    items.length = 0;
});

describe('GET route test', () => {
    test('get all items', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([item1]);
    });
});

describe('POST route test', () => {
    test('create new item', async () => {
        const res = await request(app).post('/items').send(item2);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"added": item2});
    });
    test('invalid data', async () => {
        const res = await request(app).post('/items').send({"name": "", "price": 10});
        expect(res.statusCode).toBe(400);
    });
});

describe('GET by name route test', () => {
    test('get item by name', async () => {
        const res = await request(app).get(`/items/${item1.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(item1);
    });
    test('get invalid name', async () => {
        const res = await request(app).get(`/items/nonsense`);
        expect(res.statusCode).toBe(404);
    });
});

describe('PATCH route test', () => {
    test('patch item', async () => {
        const res = await request(app).patch(`/items/${item1.name}`).send(item2);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"updated": item2});
    });
    test('invalid patch item', async () => {
        const res = await request(app).patch(`/items/nonsense`).send(item2);
        expect(res.statusCode).toBe(404);
    });
    test('invalid patch parameters', async () => {
        const res = await request(app).patch(`/items/${item1.name}`).send({"name": "", "price": 10});
        expect(res.statusCode).toBe(400);
    });
});

describe('DELETE route test', () => {
    test('delete item', async () => {
        const res = await request(app).delete(`/items/${item1.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"message": "Deleted"});
    });
    test('delete invalid item', async () => {
        const res = await request(app).delete(`/items/nonsense`);
        expect(res.statusCode).toBe(404);
    })
});