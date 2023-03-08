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
  @Index
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @Default(UserStatus.REGISTERED)
  @AllowNull(false)
  @Column(
    DataTypes.ENUM(
      UserStatus.REGISTERED,
      UserStatus.ACTIVE,
      UserStatus.INACTIVE
    )
  )
  status!: UserStatus;

  @AllowNull(false)
  @Column(DataTypes.ENUM(UserRole.ADMIN, UserRole.USER))
  role!: UserRole;
}
