import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import ApolloCLient from 'apollo-client';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';

import './index.css';
import './style/style.css';

import App from './components/common/App';
import Teachers from './components/teacher/Teachers';
import Home from './components/common/Home';
import Students from './components/common/Students';
import Configuration from './components/common/Configuration';
import StudentPage from './components/student/StudentPage';
import Course from './components/common/Course'

const client = new ApolloCLient({
    networkInterface: createNetworkInterface({ uri: 'https://effeedbackapp-qa.herokuapp.com/api/graphql'}),
});



const Root = () => {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App>
                    <Switch>
                        <Route  exact path="/" component={Teachers}/>
                        <Route  exact path="/:teacherID/configuration" component={Configuration}/>
                        <Route  exact path="/:teacherID/students" component={Students}/>
                        <Route  exact path="/:teacherID/:courseID" component={Course}/>
                        <Route  exact path="/:teacherID" component={Home}/>
                        <Route  path="/:teacherID/students/:userID" component={StudentPage}/>
                    </Switch>
                </App>
            </BrowserRouter >
        </ApolloProvider>

    );
};



ReactDOM.render(<Root />, document.getElementById('root'));
