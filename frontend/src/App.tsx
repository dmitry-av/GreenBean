import { Login, Profile, RegisterPage, VerifyUser, VerifySuccess, VerificationEmailSent } from "./pages";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, SuccessVerification, VerifyMail } from "./routes";
import { AlbumsList } from "./pages/AlbumsList";
import { AlbumDetailPage } from "./pages/AlbumDetail";
import { ReviewDetailPage } from "./pages/ReviewDetail";
import Header from "./pages/Header";
import { ToastContainer } from 'react-toastify';
import SearchResults from "./pages/SearchResults";
import ArtistDetailPage from "./pages/ArtistDetail";
import 'react-toastify/dist/ReactToastify.css';
import FavAlbumList from "./pages/FavAlbumList";
import FavArtistList from "./pages/FavArtistList";


function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <ToastContainer />
          <div className='App'>
            <Header />
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-successful" element={<SuccessVerification><VerifySuccess /></SuccessVerification>} />
              <Route path="/verify-notify" element={<VerifyMail><VerificationEmailSent /></VerifyMail>} />
              <Route path="/verify-user/" element={<VerifyUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="/albums" element={<AlbumsList />} />
              <Route path="/albums/search/:term" element={<SearchResults />} />
              <Route path="/albums/:disc_id" element={<AlbumDetailPage />} />
              <Route path="/albums/favorites" element={<ProtectedRoute><FavAlbumList /></ProtectedRoute>} />
              <Route path="/artists/favorites" element={<ProtectedRoute><FavArtistList /></ProtectedRoute>} />
              <Route path="/artists/:disc_id" element={<ArtistDetailPage />} />
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