const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//middleware DONE
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({
      error: "User not found!"
    });
  }

  request.user = user;
  return next();
}

// DONE
app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists!"
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);


});

//DONE
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(201).json(user.todos);
  // DONE
});

//DONE
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todoOperation = {
    id: uuidv4(),
    title,
    done: "false",
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todoOperation);

  return response.status(201).json(todoOperation);

  // Complete aqui
});

//DONE
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoExists = user.todos.find(todo => todo.id === id);
  const indexTodoExists = user.todos.findIndex(todo => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({
      error: "To do not found for this user!"
    });
  }

  else {
    user.todos[indexTodoExists].title = title;
    user.todos[indexTodoExists].deadline = deadline;

    return response.status(201).send();
  }

});

//DONE
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoExists = user.todos.find(todo => todo.id === id);
  const indexTodoExists = user.todos.findIndex(todo => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({
      error: "To do not found for this user!"
    });
  }

  else {
    user.todos[indexTodoExists].done = "true";

    return response.status(201).send();
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoExists = user.todos.find(todo => todo.id === id);
  const indexTodoExists = user.todos.findIndex(todo => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({
      error: "To do not found for this user!"
    });
  }

  else {
    user.todos.splice(indexTodoExists, 1);

    return response.status(201).send();
  }
});

app.listen('3333');
module.exports = app;