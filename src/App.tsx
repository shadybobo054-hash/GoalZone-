import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Live from "./pages/Live";
import Transfers from "./pages/Transfers";
import News from "./pages/News";
import Leagues from "./pages/Leagues";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Matches */}
        <Route
          path="/matches"
          element={<Matches />}
        />

        {/* Live */}
        <Route
          path="/live"
          element={<Live />}
        />

        {/* Transfers */}
        <Route
          path="/transfers"
          element={<Transfers />}
        />

        {/* News */}
        <Route
          path="/news"
          element={<News />}
        />

        {/* Leagues */}
        <Route
          path="/leagues"
          element={<Leagues />}
        />

        {/* Favorites */}
        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* Not Found */}
        <Route
          path="*"
          element={<Home />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;