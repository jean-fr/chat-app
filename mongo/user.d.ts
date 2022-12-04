declare namespace data {
  interface IUser {
    id: string;
    name: string;
    email: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IUserCreate extends Pick<IUser, 'email' | 'name'> {}

  interface IUsers {
    get(id: string): Promise<IUser | null>;
    create(entity: IUserCreate): Promise<IUser>;
    userExists(email: string): Promise<boolean>;
    getByEmail(email: string): Promise<IUser | null>;
    listAll(): Promise<IUser[]>;
  }
}
