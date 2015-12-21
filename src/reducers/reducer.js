const initialAppState = {
  todos: [],
  commandLog: [],
  undoing: false
};

const removeTodo = (appState, id) => {
  const todoIndex = appState.todos.findIndex(todo => todo.id === id);
  const todosCopy = [...appState.todos];
  todosCopy.splice(todoIndex, 1);

  return {...appState, todos: todosCopy};
};

const commitTodo = (appState, transientId, serverId) => {
  const todoIndex = appState.todos.findIndex(todo => todo.id === transientId);
  const todosCopy = [...appState.todos];
  todosCopy.splice(todoIndex, 1, {...appState.todos[todoIndex], id: serverId, transient: false});

  return {...appState, todos: todosCopy};
};

const startUndoTodo = (appState, id) => {
  const todoIndex = appState.todos.findIndex(todo => todo.id === id);
  const todosCopy = [...appState.todos];
  todosCopy.splice(todoIndex, 1, {...appState.todos[todoIndex], transient: true});

  return {...appState, todos: todosCopy};
};

const rollbackUndoTodo = (appState, id) => {
  const todoIndex = appState.todos.findIndex(todo => todo.id === id);
  const todosCopy = [...appState.todos];
  todosCopy.splice(todoIndex, 1, {...appState.todos[todoIndex], transient: false});

  return {...appState, todos: todosCopy};
};

export default (appState = initialAppState, {type, payload}) => {
  console.debug(`Handling ${type}`);

  switch (type) {
  case 'UNDO':
    return {...appState, undoing: true};
  case 'UNDONE':
    return {...appState, undoing: false};

  case 'ADD_TODO':
    return {...appState, todos: [...appState.todos, {...payload, transient: true}]};

  case 'ADD_TODO_FAILED':
  case 'ADD_TODO_UNDO_UNDONE':
    return removeTodo(appState, payload.id);

  case 'TODO_ADDED':
    return commitTodo(appState, payload.transientId, payload.serverId);

  case 'ADD_TODO_UNDO':
    return startUndoTodo(appState, payload.id);

  case 'ADD_TODO_UNDO_FAILED':
    return rollbackUndoTodo(appState, payload.id);

  case 'PUSH_COMMAND':
    return {...appState, commandLog: [...appState.commandLog, payload]};
  case 'POP_COMMAND':
    return {...appState, commandLog: appState.commandLog.slice(0, -1)};
  default:
    console.warn(`Unhandled action ${type}`);
    return appState;
  }
};
