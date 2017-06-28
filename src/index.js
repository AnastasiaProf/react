import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import ApolloCLient from 'apollo-client';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';

import './index.css';
import './style/style.css';

import App from './components/common/App';
import Home from './components/common/Home';
import Students from './components/common/Students';
import Configuration from './components/common/Configuration';
import StudentPage from './components/student/StudentPage';

const client = new ApolloCLient({
   networkInterface: createNetworkInterface({ uri: 'https://effeedbackapp-qa.herokuapp.com/api/graphql'}),
});

// ReactDOM.render(<App />, document.getElementById('root'));

const Root = () => {
  return (
    <ApolloProvider client={client}>
    	<BrowserRouter>
    		<App>
      		<Switch>
          	<Route exact path="/" component={Home}/> 
          	<Route  exact path="/students" component={Students}/> 
            <Route  path="/students/:userID" component={StudentPage}/>
          	<Route  path="/configuration" component={Configuration}/>   
        	</Switch>
        </App>
      </BrowserRouter >
    </ApolloProvider>

   );
};



ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
