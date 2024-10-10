import { useEffect } from 'react';
import './App.css';
import PageContainer from './components/PageContainer';
import MainRoutes from './MainRoutes';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './configs/firebaseConfig';
import { getUserData, getUserFriends } from './redux/slices/userSlice';

function App() {



  return (
    <>
      <Router>
        <ToastContainer />
        <PageContainer>
          <MainRoutes />
        </PageContainer>
      </Router>
    </>
  );
}

export default App;
