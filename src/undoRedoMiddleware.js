const last = arr => arr[arr.length - 1];

const isAsyncIterable = () => true;

export default ({dispatch, getState}) => next => action => {
  if (typeof action === 'function') {
    const command = action(dispatch);

    if (isAsyncIterable(command)) {
      command
        .next()
        .then(value => {
          if (!value.done) {
            dispatch({type: 'PUSH_COMMAND', payload: command});
          }

          dispatch(value.value);
        });

      return action;
    }
  } else if (action.type === 'UNDO') {
    const commandLog = getState().commandLog;

    if (commandLog.length > 0 && !getState().undoing) {
      const command = last(commandLog);

      command
        .next()
        .then(value => {
          if (value.done) {
            dispatch({type: 'POP_COMMAND'});
          }

          dispatch(value.value);
          dispatch({type: 'UNDONE'});
        });
    }
  }

  return next(action);
};
