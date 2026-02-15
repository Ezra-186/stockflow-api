jest.mock('../data/database', () => ({
  getDb: jest.fn()
}));

const mongodb = require('../data/database');
const controller = require('../controllers/users');

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
});

describe('users controller GET routes', () => {
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

  test('getAll should return 200 and users array', async () => {
    const req = {};
    const res = createMockRes();
    const users = [{ username: 'ezra-dev' }, { username: 'ana-dev' }];

    mockToArray.mockResolvedValue(users);

    await controller.getAll(req, res);

    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('getSingle should return 400 for invalid user id', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = createMockRes();

    await controller.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user id' });
  });

  test('getSingle should return 404 when user is not found', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();

    mockFindOne.mockResolvedValue(null);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('getSingle should return 200 and the user for valid id', async () => {
    const req = { params: { id: '507f191e810c19729de860ea' } };
    const res = createMockRes();
    const user = { _id: req.params.id, username: 'ezra-dev' };

    mockFindOne.mockResolvedValue(user);

    await controller.getSingle(req, res);

    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });
});
