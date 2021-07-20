import { PrismaClient } from "@prisma/client";
import {
  User,
  UserAlreadyExistsError,
  UserCreationSuccess,
  UserDoesNotExistError,
} from "../graphql/user/schemas/User";

const prisma = new PrismaClient();

async function createNewUser(
  params: any
): Promise<UserCreationSuccess | UserAlreadyExistsError> {
  const phoneExists = await prisma.user.findUnique({
    where: { phone: params.phone },
  });
  const emailExists = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (!emailExists && !phoneExists) {
    const _createdUser = await prisma.user.create({ data: params });
    const _result = new UserCreationSuccess();
    _result.user = _createdUser;
    return _result;
  } else {
    const _error = new UserAlreadyExistsError();
    _error.message = `User with ${
      phoneExists ? params.phone : params.email
    } already exists!!`;
    return _error;
  }
}

async function getUser(
  params: string,
  isPhone: boolean
): Promise<User | UserDoesNotExistError> {
  const _user = await prisma.user.findFirst({
    where: isPhone ? { phone: params } : { email: params },
  });
  if (_user) {
    return _user;
  } else {
    const _error = new UserDoesNotExistError();
    _error.message = `User with ${params} does not exist!!`;
    return _error;
  }
}

async function login(data: any) {
  const user = await prisma.user.findFirst({
    where: {
      password: data.password,
      phone: data.phone,
    },
  });
}

export { createNewUser, getUser };
