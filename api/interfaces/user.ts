//   import { UserConversion, User } from "/api/interfaces/User.ts";
//   const User = UserConversion.fromJson(json);

export interface User {
  id?: number;
  email?: string;
  blocked?: boolean;
  username?: string;
  password?: string;
  user_info?: UserInfo;
  role?: Role;
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
}

export interface Role {
  id?: number;
  name?: string;
}

export class UserConversion {
  public static fromJson(json: string): User {
    return json as User;
  }

  public static toJson(value: User): string {
    return JSON.stringify(value);
  }
}
