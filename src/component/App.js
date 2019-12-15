import React from 'react';
import { Provider } from 'mobx-react';
import Game from './Game';
import GameModel from '../models/GameModel';

const App = () => {

  const mainStore = new GameModel();

  return (
      <Provider mainStore={mainStore} >
        <Game/>
      </Provider>
  );
}

export default App;
