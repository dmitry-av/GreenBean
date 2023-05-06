import { Login, Profile, RegisterPage } from "./pages";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AlbumsList } from "./pages/AlbumsList";
import { AlbumDetailPage } from "./pages/AlbumDetail";
import { ReviewDetailPage } from "./pages/ReviewDetail";
import Header from "./pages/Header";
import SearchResults from "./pages/SearchResults";

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <div className='App'>
            <Header />
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/albums" element={<AlbumsList />} />
              <Route path="/albums/search/:term" element={<SearchResults />} />
              <Route path="/albums/:disc_id" element={<AlbumDetailPage />} />
              <Route path="/reviews/:id" element={<ReviewDetailPage />} />
              <Route path="/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

/**    <Route path="/albums" element={<Albums />} />           <NewAlbum onAddAlbum={addAlbum} />
            <ProtectedRoute path="/" element={<Profile />} /> */