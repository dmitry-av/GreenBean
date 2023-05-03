import { Login, Profile } from "./pages";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Albums from './components/Albums';
import { AlbumsList } from "./pages/AlbumsList";

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <div className='App'>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/albums" element={<AlbumsList />} />
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