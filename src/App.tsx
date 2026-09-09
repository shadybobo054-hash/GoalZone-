import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import GoalZoneAI from "./components/GoalZoneAI";

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
      {/* NAVBAR */}
      <Navbar />

      {/* PAGES */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/matches"
          element={<Matches />}
        />

        <Route
          path="/live"
          element={<Live />}
        />

        <Route
          path="/transfers"
          element={<Transfers />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/leagues"
          element={<Leagues />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Home />}
        />
      </Routes>

      {/* GOALZONE AI */}
      <GoalZoneAI />
    </BrowserRouter>
  );
}

export default App;