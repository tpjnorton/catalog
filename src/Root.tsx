import { Spinner } from '@chakra-ui/react';
import App from 'App';
import { auth } from 'firebase-details';
import LoggedOutApp from 'LoggedOutApp';
import { useState } from 'react';

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  auth.onAuthStateChanged((user) => {
    console.log(user);
    setIsLoggedIn(!!user);
    setLoading(false);
  });

  if (loading) {
    return <Spinner />;
  }
  return isLoggedIn ? <App /> : <LoggedOutApp />;
};

export default Root;
