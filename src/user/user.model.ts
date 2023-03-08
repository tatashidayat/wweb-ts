import {DataTypes, Optional} from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {UserRole, UserStatus} from '../common/constant/role';

export interface UserAttributes {
  id: string;
  name: string;
  status: UserStatus;
  role: UserRole;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: true,
  modelName: 'User',
  tableName: 'user',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column
  @PrimaryKey
  @AllowNull(false)
  @Index
  id!: string;

  @Column
  @AllowNull(false)
  name!: string;

  @Column(DataTypes.ENUM)
  @Default(UserStatus.REGISTERED)
  @AllowNull(false)
  status!: UserStatus;

  @Column(DataTypes.ENUM)
  @AllowNull(false)
  role!: UserRole;
}
