import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';

import undoRedoMiddleware from './undoRedoMiddleware';
import reducer from './reducers/reducer';
import Application from './components/Application';

const storeFactory = compose(
  applyMiddleware(undoRedoMiddleware)
)(createStore);

const store = storeFactory(reducer);

render(
  <Application store={store} />,
  document.getElementById('app-container')
);
