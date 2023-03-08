import {User, UserCreationAttributes} from './user.model';

class UserRepository {
  async getAll(): Promise<User[]> {
    const result = await User.findAll();
    return result;
  }

  async getById(id: string): Promise<User | undefined> {
    const user = await User.findByPk(id);
    return user || undefined;
  }

  async create(user: UserCreationAttributes): Promise<User> {
    const createdUser = await User.create(user);
    return createdUser;
  }
}
