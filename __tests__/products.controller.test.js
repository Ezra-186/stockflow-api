jest.mock('../data/database', () => ({
  getDb: jest.fn()
}));

const mongodb = require('../data/database');
const controller = require('../controllers/products');

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
});

describe('products controller GET routes', () => {
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

  test('getAll should return 200 and products array', async () => {
    const req = {};
    const res = createMockRes();
    const products = [{ name: 'Widget' }, { name: 'Gadget' }];

    mockToArray.mockResolvedValue(products);

    await controller.getAll(req, res);

    expect(mockCollection).toHaveBeenCalledWith('products');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  test('getSingle should return 400 for invalid product id', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = createMockRes();

    await controller.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid product id' });
  });

  test('getSingle should return 404 when product is not found', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();

    mockFindOne.mockResolvedValue(null);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('products');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  test('getSingle should return 200 and the product for valid id', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();
    const product = { _id: req.params.id, name: 'Widget' };

    mockFindOne.mockResolvedValue(product);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('products');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
  });
});
