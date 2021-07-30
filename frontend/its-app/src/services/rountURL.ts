export  enum RountGuest {
    Login = '/',
    Register = '/Register',
    ResetPassword = '/ResetPassword'
   
}

export  enum RountUsers {
    Home = '/Home',
    ShowSchool = '/ShowSchool',
    DataSchool = '/DataSchool/',
    ExamTest = '/ExamTest',
    TestResults = '/TestResults',
    StudentScore = '/StudentScoreShow/',
    TestModeExam = '/TestModeExam',
    PersonalInfor ='/PersonalInfor',
}

export  enum RountAdmin {
    AddSchool = '/AddSchool',
    EditSchool = '/EditSchool/',

    AddExam = '/Addexam',
    EditExam = '/EditExam/',
    ShowExam = '/ShowExam',

    EditSkill = '/EditSkill/',
    AddSkill = '/AddSkill/',
    ShowSkill = '/ShowSkill',
    
    ShowQuizSet = '/ShowQuizSet',
    AddQuizSet = '/AddQuizSet/',
    EditQuizSet = '/EditQuizSet/',
    AddSubExam = '/AddSubExam/'  ,

    AddTestMode = "/AddTestMode",
    ShowChoiceTestMode = "/ShowChoiceTestMode",
    EditTestMode = '/EditTestMode/',
    EvaluationResults = '/EvaluationResults'
    
}