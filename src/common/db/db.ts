import {DataSource} from 'typeorm';
import {User} from '../../user/user.model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '192.168.1.200',
  port: 5432,
  username: 'pgwweb',
  password: 'pgpassword',
  database: 'wweb',
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});
