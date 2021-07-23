import { Todo } from "api/graphql/todo/schema/Todo";

async function getTodosByUser(userId: number): Promise<Todo> {
  return new Todo();
}

async function createTodo(todo: Todo): Promise<Todo> {
  return new Todo();
}

async function updateTodo(data: any): Promise<Todo> {
  return new Todo();
}


export { updateTodo, createTodo, getTodosByUser };