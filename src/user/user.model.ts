// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Column, Entity, PrimaryColumn} from 'typeorm';
import {UserRole, UserStatus} from '../common/constant/role';

@Entity({
  name: 'users',
  synchronize: true,
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({enum: UserStatus, default: UserStatus.REGISTERED})
  status!: UserStatus;

  @Column({enum: UserRole})
  role!: UserRole;

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isRegularUser(): boolean {
    return this.role === UserRole.USER;
  }
}
