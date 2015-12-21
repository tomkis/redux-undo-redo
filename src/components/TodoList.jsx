import React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions/actions';

const mapStateToProps = appState => appState;

const renderUndoButton = (dispatch, commandLog) => {
  if (commandLog.length > 0) {
    return <button onClick={() => dispatch(Actions.undo())}>Undo</button>;
  } else {
    return false;
  }
};

export default connect(mapStateToProps)(props => (
  <div>
    <button onClick={() => props.dispatch(Actions.addTodo('Testing todo'))}>Add todo</button>
    <br />
    {renderUndoButton(props.dispatch, props.commandLog)}
    <ul>
      {props.todos.map(todo =>
          <li
            style={{color: todo.transient ? 'blue' : 'black'}}
            key={todo.id}>
            {todo.todo} - {todo.id}
          </li>)}
    </ul>
  </div>
));
