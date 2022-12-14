import { IUser } from ".";
import _APIRepo from "./_APIRepo";

export interface IUserCreate extends Pick<IUser, "email" | "name"> {}

export default class UserRepo extends _APIRepo {
  public addUser = async (data: IUserCreate): Promise<IUser> => {
    return this.http.post(this.url, data);
  };

  public getUserByEmail = async (email: string): Promise<IUser> => {
    return this.http.get(`${this.url}/email/${email}`);
  };

  public getUserById = async (userId: string): Promise<IUser> => {
    return this.http.get(`${this.url}/${userId}`);
  };

  public listAllUsers = async (): Promise<IUser[]> => {
    return this.http.get(this.url);
  };
}
