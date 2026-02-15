jest.mock('../data/database', () => ({
  getDb: jest.fn()
}));

const mongodb = require('../data/database');
const controller = require('../controllers/orders');

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
});

describe('orders controller GET routes', () => {
  let mockCollection;
  let mockFind;
  let mockToArray;
  let mockFindOne;

  beforeEach(() => {
    jest.clearAllMocks();

    mockToArray = jest.fn();
    mockFind = jest.fn(() => ({ toArray: mockToArray }));
    mockFindOne = jest.fn();
    mockCollection = jest.fn(() => ({
      find: mockFind,
      findOne: mockFindOne
    }));

    mongodb.getDb.mockReturnValue({
      collection: mockCollection
    });
  });

  test('getAll should return 200 and orders array', async () => {
    const req = {};
    const res = createMockRes();
    const orders = [{ status: 'pending' }, { status: 'processing' }];

    mockToArray.mockResolvedValue(orders);

    await controller.getAll(req, res);

    expect(mockCollection).toHaveBeenCalledWith('orders');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  test('getSingle should return 400 for invalid order id', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = createMockRes();

    await controller.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid order id' });
  });

  test('getSingle should return 404 when order is not found', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();

    mockFindOne.mockResolvedValue(null);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('orders');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
  });

  test('getSingle should return 200 and the order for valid id', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();
    const order = { _id: req.params.id, status: 'pending' };

    mockFindOne.mockResolvedValue(order);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('orders');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(order);
  });
});
