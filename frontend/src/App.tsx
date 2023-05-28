import { Login, Profile, RegisterPage, VerifyUser, VerifySuccess, VerificationEmailSent, PopupWindow } from "./components/AuthComponents";
import store, { RootState, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, SuccessVerification, VerifyMail } from "./routes";
import AlbumDetailPage from "./components/AlbumDetail";
import ArtistDetailPage from "./components/ArtistDetail";
import ReviewDetailPage from "./components/ReviewDetail";
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify';
import SearchResults from "./components/SearchResults";
import FavAlbumList from "./components/FavAlbumList";
import FavArtistList from "./components/FavArtistList/FavArtistList";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./components/HomePage";
import PopupContainer from "./routes/PopupContainer";


function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <ToastContainer />
          <PopupContainer />
          <div className='App'>
            <Header />
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-successful" element={<SuccessVerification><VerifySuccess /></SuccessVerification>} />
              <Route path="/verify-notify" element={<VerifyMail><VerificationEmailSent /></VerifyMail>} />
              <Route path="/verify-user/" element={<VerifyUser />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/albums/search/:term" element={<SearchResults />} />
              <Route path="/albums/:disc_id" element={<AlbumDetailPage />} />
              <Route path="/albums/favorites" element={<ProtectedRoute><FavAlbumList /></ProtectedRoute>} />
              <Route path="/artists/favorites" element={<ProtectedRoute><FavArtistList /></ProtectedRoute>} />
              <Route path="/artists/:disc_id" element={<ArtistDetailPage />} />
              <Route path="/reviews/:id" element={<ReviewDetailPage />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;