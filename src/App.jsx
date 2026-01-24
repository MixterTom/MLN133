import { GameProvider, useGame } from './contexts/GameContext';
import StartScreen from './components/Screens/StartScreen';
import PrologueScreen from './components/Screens/PrologueScreen';
import Chapter1Screen from './components/Screens/Chapter1Screen';
import Chapter2Screen from './components/Screens/Chapter2Screen';
import Chapter3Screen from './components/Screens/Chapter3Screen';
import Chapter4Screen from './components/Screens/Chapter4Screen';
import Chapter5Screen from './components/Screens/Chapter5Screen';
import GameOverScreen from './components/Screens/GameOverScreen';
import './App.css';

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'start':
      return <StartScreen />;

    case 'prologue':
      return <PrologueScreen />;

    case 'chapter1':
      return <Chapter1Screen />;

    case 'chapter2':
      return <Chapter2Screen />;

    case 'chapter3':
      return <Chapter3Screen />;

    case 'chapter4':
      return <Chapter4Screen />;

    case 'chapter5':
      return <Chapter5Screen />;

    case 'gameover':
      return <GameOverScreen />;

    default:
      return <StartScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
