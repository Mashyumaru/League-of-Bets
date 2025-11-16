import { Routes, Route } from 'react-router-dom';
import MatchList from './pages/MatchList';
import MyBets from './pages/MyBets';
import Rules from './pages/Rules';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MatchList />} />
      <Route path="/mes-paris" element={<MyBets />} />
      <Route path="/regles" element={<Rules />} />
    </Routes>
  );
}

export default App;