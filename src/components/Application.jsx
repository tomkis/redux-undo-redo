import React from 'react';
import { Provider } from 'react-redux';

import TodoList from './TodoList';

export default props => (
  <Provider store={props.store}>
    <TodoList />
  </Provider>
);
