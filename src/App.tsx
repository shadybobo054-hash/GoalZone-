
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Live from "./pages/Live";
import Transfers from "./pages/Transfers";
import News from "./pages/News";
import Favorites from "./pages/Favorites";
import MatchDetails from "./pages/MatchDetails";
import TeamDetails from "./pages/TeamDetails";

import "./App.css";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Matches */}
        <Route
          path="/matches"
          element={
            <Matches
              onDetails={(match) =>
                navigate(`/match/${match.id}`, {
                  state: {
                    match,
                    from: "matches",
                  },
                })
              }
            />
          }
        />

        {/* Live */}
        <Route
          path="/live"
          element={
            <Live
              onDetails={(match) =>
                navigate(`/match/${match.id}`, {
                  state: {
                    match,
                    from: "live",
                  },
                })
              }
            />
          }
        />

        {/* Other Pages */}
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/news" element={<News />} />

        {/* Favorites */}
        <Route path="/favorites" element={<Favorites />} />

        {/* Team Details */}
        <Route path="/team/:id" element={<TeamDetails />} />

        {/* Match Details */}
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

