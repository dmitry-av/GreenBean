import { Login, Profile, RegisterPage, VerifyUser, VerifySuccess, VerificationEmailSent } from "./components/AuthComponents";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, SuccessVerification, VerifyMail } from "./routes";
import AlbumDetailPage from "./components/AlbumDetail";
import ArtistDetailPage from "./components/ArtistDetail";
import ReviewDetailPage from "./components/ReviewDetail";
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify';
import SearchResults from "./components/SearchResults/SearchResults";
import FavAlbumList from "./components/FavAlbumList/FavAlbumList";
import FavArtistList from "./components/FavArtistList/FavArtistList";
import 'react-toastify/dist/ReactToastify.css';


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