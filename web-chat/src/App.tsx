import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import User from "./components/User";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/user/:userId" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
