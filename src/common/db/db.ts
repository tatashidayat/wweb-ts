import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize(
  'postgres://pgwweb:pgpassword@192.168.1.200:5432/wweb'
);
