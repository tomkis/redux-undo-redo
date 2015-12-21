const api = arg => {
  console.log(arg);

  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve(Math.random());
    } else {
      reject();
    }
  }, 500));
};

export const undo = () => ({type: 'UNDO'});

export const addTodo = todo => async function*(dispatch) {
  let serverId = null;
  const transientId = `transient-${new Date().getTime()}`;

  dispatch({
    type: 'ADD_TODO',
    payload: {
      id: transientId,
      todo
    }
  });

  try {
    serverId = await api(`Create todo ${todo}`);

    yield {
      type: 'TODO_ADDED',
      payload: {
        transientId,
        serverId
      }
    };
  } catch (ex) {
    console.error(`Adding ${todo} failed`);

    return {
      type: 'ADD_TODO_FAILED',
      payload: {
        id: transientId
      }
    };
  }

  while (true) {
    dispatch({
      type: 'ADD_TODO_UNDO',
      payload: {
        id: serverId
      }
    });

    try {
      await api(`Undo created todo with id ${serverId}`);

      return {
        type: 'ADD_TODO_UNDO_UNDONE',
        payload: {
          id: serverId
        }
      };
    } catch (ex) {
      yield {
        type: 'ADD_TODO_UNDO_FAILED',
        payload: {
          id: serverId
        }
      };
    }
  }
};
