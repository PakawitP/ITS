import React from 'react'

import Login from "./auth/Login"
import Register from './auth/Register'

// import Home from './user/Home'
import AddSchool from './admin/AddSchool'
import Exam from './admin/AddExam'
import Showschool from './user/ShowSchool'
import DataSchool from './user/DataSchool'
import AdminExam from './admin/AdminExam'
import ShowSkill from './admin/ShowSkill'
import AddSkill from './admin/AddSkill'
import ShowQuizSet from './admin/ShowQuizSet'
import QuizSet from './admin/AddQuizSet'
import NoMatch from './Nomatch'
import EditSkill from './admin/EditSkill'
import EditQuizSet from './admin/EditQuizSet'
import EditSchool from './admin/EditSchool'
import EditExam from './admin/EditExam'
import UserExam from './user/UserExam'
import TestResults from './user/TestResults'
import StudentShowScore from './user/StudentShowScore'
import TestModeAdd from './admin/TestModeAdd'
import ShowChoiceTestMode from './admin/ShowChoiceTestMode'
import EditTestMode from './admin/EditTestMode'
import TestModeExam from './user/TestModeExam'
import EvaluationResults from './admin/EvaluationResults'
import ResetPasswoed from './auth/ResetPasswoed'
import PersonalInfor from './user/PersonalInfor'

import { Switch, Route } from "react-router-dom"
import PublicRoute from './auth/Public.rountes'
import PrivateRoute from './Private.routes'
import { RountGuest, RountUsers, RountAdmin } from '../services/rountURL'


const Routes: React.FC = () => {

  return (
    <Switch>
      {/* <Route exact path="/">
          <Login />
        </Route>
        <Route path="/Register">
          <Register />
        </Route> */}
      <PublicRoute
        path={RountGuest.Login}
        exact
        component={Login}
        redirectPath={RountUsers.Home}
      />
      <PublicRoute
        path={RountGuest.Register}
        component={Register}
        redirectPath={RountUsers.Home}
      />
      <PublicRoute
        path={RountGuest.ResetPassword}
        component={ResetPasswoed}
        redirectPath={RountUsers.Home}
      />
      <PrivateRoute
        path={RountUsers.Home}
        component={Showschool}
        role={"User"}
        redirectPath={RountGuest.Login}
      />
      {/* <Route path={RountUsers.Home}>
        <Showschool />
      </Route> */}
      <PrivateRoute
        path={RountAdmin.AddExam}
        component={Exam}
        redirectPath={RountUsers.Home}
      />
      <PrivateRoute
        path={RountAdmin.EditSchool + ":id"}
        component={EditSchool}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.AddSchool}
        exact
        component={AddSchool}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.ShowSchool}
        component={Showschool}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.DataSchool + ":id"}
        component={DataSchool}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.ShowExam}
        component={AdminExam}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.EditExam + ":id"}
        component={EditExam}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.AddSubExam + ":id"}
        component={Exam}
        redirectPath={RountUsers.Home}
      />


      <PrivateRoute
        path={RountAdmin.ShowSkill}
        component={ShowSkill}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.EditSkill + ":id"}
        component={EditSkill}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.AddSkill}
        component={AddSkill}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.ShowQuizSet}
        component={ShowQuizSet}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.EditQuizSet + ":id"}
        component={EditQuizSet}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.AddQuizSet}
        component={QuizSet}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.ExamTest}
        component={UserExam}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.TestResults}
        component={TestResults}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.StudentScore + ":id"}
        component={StudentShowScore}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.AddTestMode}
        component={TestModeAdd}
        // role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.ShowChoiceTestMode}
        component={ShowChoiceTestMode}
        // role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.EditTestMode + ":id"}
        component={EditTestMode}
        // role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.TestModeExam}
        component={TestModeExam}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountAdmin.EvaluationResults}
        component={EvaluationResults}
        // role={"User"}
        redirectPath={RountUsers.Home}
      />

      <PrivateRoute
        path={RountUsers.PersonalInfor}
        component={PersonalInfor}
        role={"User"}
        redirectPath={RountUsers.Home}
      />

      <Route path="*">
        <NoMatch />
      </Route>

    </Switch>


  );
}

export default Routes;