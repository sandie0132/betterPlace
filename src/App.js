import React from 'react';
import _ from 'lodash';

import { AuthConsumer } from './services/authContext';
import HandleLogin from './services/Auth/HandleLogin';
import Home from '../src/containers/Home/Home';
import ErrorHandler from './components/Molecule/ErrorHandler/ErrorHandler';

function App() {
  return (
    <AuthConsumer>
      {
        ({ authenticated, user }) => {
          if(authenticated && user){
            return (
              <div className="container-fluid px-0">
                <ErrorHandler>
                  {
                    !_.isEmpty(user) ?
                    <Home />
                    : null
                  }
                </ErrorHandler>
              </div>
            )
          }
          else {
            return ( <HandleLogin /> )
          }
        }
      }
    </AuthConsumer>
  );
}

export default App;
