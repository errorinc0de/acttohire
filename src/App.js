import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { AuthProvider } from './context/AuthProvider';

import Hrlogin from './route/hr/Hrlogin';
import College_login from './route/college/College_login';
import HrRegister from './route/hr/HrRegister';
import HrSubscription from './route/hr/HrSubscription';
import Login from './route/student/Login';
import Register from './route/student/Register';
import Dashboard from './route/student/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CollegePrivateRoute from './components/CollegePrivateRoute';
import HrPrivateRoute from './components/HrPrivateRoute'
import Profile from './route/student/Profile';
import College_registration from './route/college/College_registration';
import College_settings from './route/college/College_settings';
import College_subscription from './route/college/college_subscription';
import HrSettings from './route/hr/HrSettings';
import CollegeDashboard from './route/college/CollegeDashboard';
import HrDashboard from './route/hr/HrDashboard';
import Awards from './route/student/Awards';
import Job from './route/student/Job';
import JobDet from './route/student/JobDet';
import College_JobDet from './route/college/College_JobDet';
import HrDataDownload from './route/hr/HrDataDownload';
import College_jobs from './route/college/College_jobs';
import Hr_jobs from './route/hr/Hr_jobs';
import College_student from './route/college/College_student';
import Student_settings from './route/student/Student_settings';
import Stats from './route/student/Stats';
import ProfileDesc from './route/student/ProfileDesc';
import HrJobDet from './route/hr/HrJobDet';
import HrOffers from './route/hr/HrOffers'
function App() {
  return (
    <>
    <AuthProvider>
    <Router>
      <Switch>
            <PrivateRoute exact path="/student-settings" component={Student_settings}></PrivateRoute>
            <PrivateRoute exact path="/profile" component={Profile} ></PrivateRoute>
            <PrivateRoute exact path="/stats" component={Stats} ></PrivateRoute>
            <PrivateRoute exact path="/dashboard" component={Dashboard} ></PrivateRoute>
            <PrivateRoute exact path="/awards" component={Awards} ></PrivateRoute>
            <PrivateRoute exact path="/jobs" component={Job} ></PrivateRoute>
            <PrivateRoute exact path="/job/:jobid" component={JobDet} ></PrivateRoute>
        
            <HrPrivateRoute exact path="/hr-subscription" component={HrSubscription} ></HrPrivateRoute>
            <HrPrivateRoute exact path="/hr-jobs" component={Hr_jobs}></HrPrivateRoute>
            <HrPrivateRoute exact path="/hr-data-retrieve" component={HrDataDownload} />
            <HrPrivateRoute exact path="/hr-dashboard" component={HrDashboard}></HrPrivateRoute>
            <HrPrivateRoute exact path="/hr-settings" component={HrSettings}></HrPrivateRoute>
            <HrPrivateRoute exact path="/hr-jobs/:jobid" component={HrJobDet}></HrPrivateRoute>
            <HrPrivateRoute exact path="/hr-offers" component={HrOffers}></HrPrivateRoute>
            
            <CollegePrivateRoute exact path="/college-dashboard" component={CollegeDashboard}></CollegePrivateRoute>
            <CollegePrivateRoute exact path="/college-subscription" component={College_subscription} ></CollegePrivateRoute>
            <CollegePrivateRoute exact path="/college-student" component={College_student} ></CollegePrivateRoute>
            <CollegePrivateRoute exact path="/college-settings" component={College_settings} ></CollegePrivateRoute>
            <CollegePrivateRoute exact path="/college-job" component={College_jobs} ></CollegePrivateRoute>
            <CollegePrivateRoute exact path="/college-job/:jobid" component={College_JobDet} ></CollegePrivateRoute>

            <Route exact path="/register" component={Register} ></Route>
            <Route exact path="/hr-login" component={Hrlogin} ></Route>
            <Route exact path="/hr-register" component={HrRegister} ></Route>
            <Route exact path="/college-login" component={College_login} ></Route>
            <Route exact path="/college-registration" component={College_registration} ></Route>
            <Route exact path="/profile/:profileid" component={ProfileDesc} ></Route>
            <Route exact path="/" component={Login} ></Route>
      </Switch>
    </Router>
    </AuthProvider>
    </>
  )
}
export default App;
