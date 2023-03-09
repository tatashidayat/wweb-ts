import {Repository} from 'typeorm';
import {UserRole, UserStatus} from '../common/constant/role';
import {AppDataSource} from '../common/db/db';
import {User} from './user.model';

export class UserRepository {
  private _pgDatasource: Repository<User>;

  constructor() {
    this._pgDatasource = AppDataSource.getRepository(User);
  }

  async getAll(): Promise<User[]> {
    const result = await this._pgDatasource.find();
    return result;
  }

  async getById(id: string): Promise<User | null> {
    const user = await this._pgDatasource.findOne({where: {id: id}});
    return user;
  }

  async getActiveUserByPhone(phoneNumber: string) {
    const user = await this._pgDatasource.findOne({
      where: {id: phoneNumber, status: UserStatus.ACTIVE},
    });
    return user;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this._pgDatasource.save(user);
    return createdUser;
  }

  async activate(id: string): Promise<boolean> {
    const result = await this._pgDatasource.update(
      {id: id},
      {status: UserStatus.ACTIVE}
    );

    return Boolean(result.affected && result.affected > 0);
  }

  async deactivate(id: string): Promise<boolean> {
    const result = await this._pgDatasource.update(
      {id: id},
      {status: UserStatus.INACTIVE}
    );

    return Boolean(result.affected && result.affected > 0);
  }

  async changeRole(id: string, role: UserRole): Promise<boolean> {
    const result = await this._pgDatasource.update({id: id}, {role: role});

    return Boolean(result.affected && result.affected > 0);
  }
}
