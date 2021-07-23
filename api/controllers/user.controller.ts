import { PrismaClient } from "@prisma/client";
import {
  User,
  UserAlreadyExistsError,
  UserAuthenticationSuccess,
  UserDoesNotExistError,
  UserLoginError,
} from "../graphql/user/schema/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

async function register(
  params: any
): Promise<UserAuthenticationSuccess | UserAlreadyExistsError> {
  const _user = {
    name: params.name,
    email: params.email,
    phone: params.phone,
    password: params.password,
    createdAt: new Date(Date()),
    lastLoginDevice: params.lastLoginDevice,
    lastLoginTime: new Date(Date()),
  };
  const phoneExists = await prisma.user.findUnique({
    where: { phone: _user.phone },
  });
  const emailExists = await prisma.user.findUnique({
    where: { email: _user.email },
  });
  if (!emailExists && !phoneExists) {
    const _encryptedPassword = await bcrypt.hash(_user.password, 10);
    _user.password = _encryptedPassword;
    const _createdUser = await prisma.user.create({ data: _user });
    const _jwtToken = jwt.sign({ userId: _createdUser.id }, jwtSecretKey);
    const _result = new UserAuthenticationSuccess();
    _result.user = _createdUser;
    _result.token = _jwtToken;
    return _result;
  } else {
    const _error = new UserAlreadyExistsError();
    _error.message = `User with ${
      phoneExists ? params.phone : params.email
    } already exists!!`;
    return _error;
  }
}

async function getCurrentUser(params: number): Promise<User | UserDoesNotExistError> {
  console.log(params);
  const _user = await prisma.user.findUnique({
    where: { id: params },
  });
  if (_user) {
    return _user;
  } else {
    const _error = new UserDoesNotExistError();
    _error.message = `User with ${params} does not exist!!`;
    return _error;
  }
}

async function login(
  data: any
): Promise<UserAuthenticationSuccess | UserLoginError> {
  var _user;
  var _error = new UserLoginError();
  if (data.phone) {
    _user = await prisma.user.findUnique({
      where: {
        phone: data.phone,
      },
    });
  } else if (data.email) {
    _user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  }
  if (!_user) {
    _error.message = `No user associated with ${
      data.phone != null ? data.phone : data.email
    } found!! Please enter correct details`;
    return _error;
  }
  const _validUser = await bcrypt.compare(data.password, _user?.password!);
  if (!_validUser) {
    _error.message = "Incorrect credentials. Please try again!";
    return _error;
  }

  _user = await prisma.user.update({
    where: { id: _user.id },
    data: {
      lastLoginTime: new Date(Date()),
    },
  });
  const _token = jwt.sign({ userId: _user.id }, jwtSecretKey);
  const _result = new UserAuthenticationSuccess();
  _result.token = _token;
  _result.user = _user;
  return _result;
}

export { register, getCurrentUser, login };
