jest.mock('../data/database', () => ({
  getDb: jest.fn()
}));

const mongodb = require('../data/database');
const controller = require('../controllers/customers');

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
});

describe('customers controller GET routes', () => {
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

  test('getAll should return 200 and customers array', async () => {
    const req = {};
    const res = createMockRes();
    const customers = [{ firstName: 'Ezra' }, { firstName: 'Ana' }];

    mockToArray.mockResolvedValue(customers);

    await controller.getAll(req, res);

    expect(mockCollection).toHaveBeenCalledWith('customers');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(customers);
  });

  test('getSingle should return 400 for invalid customer id', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = createMockRes();

    await controller.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid customer id' });
  });

  test('getSingle should return 404 when customer is not found', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();

    mockFindOne.mockResolvedValue(null);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('customers');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
  });

  test('getSingle should return 200 and the customer for valid id', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();
    const customer = { _id: req.params.id, firstName: 'Ezra' };

    mockFindOne.mockResolvedValue(customer);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('customers');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(customer);
  });
});
