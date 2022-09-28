import { Routes, Route } from 'react-router-dom'
import { Help } from './pages/Help';
import Web3Integration from './pages/Integration';

function App() {
  return (
    <div className="App">
     <Routes>
       <Route exact path="/" element={<Web3Integration />} />
       <Route path="/help" element={<Help />} />
     </Routes>
    </div>
  );
}

export default App;
