
export  enum URL {

    //Login API
    API_Login = 'http://localhost:8000/its/Login',
    API_Register = 'http://localhost:8000/its/Register',
    API_ResetPassword = 'http://localhost:8000/its/reset_password',
    API_AnsResetPassword = 'http://localhost:8000/its/ans_reset_password',
    API_UpdateUser = 'http://localhost:8000/its/update_user',

    //School
    API_School = 'http://localhost:8000/its/get_school_all',
    API_SchoolGuest = 'http://localhost:8000/its/get_school_guest',
    API_SchoolGuest_ALL = 'http://localhost:8000/its/get_school_all_guest',
    API_GetSchoolID = 'http://localhost:8000/its/get_school/school_id',
    API_CreateSchool = 'http://localhost:8000/its/create_school',
    API_UpdateSchool = 'http://localhost:8000/its/update_school',
    API_ResultsSchool='http://localhost:8000/its/get_score_by_school_id',
    API_DeleteSchool = 'http://localhost:8000/its/del_school',

    //Exam
    API_ShowAdminExam = 'http://localhost:8000/its/get_quiz/quiz_set_id',
    API_GetExamID ='http://localhost:8000/its/get_quiz/quiz_id',
    API_CreateExam = 'http://localhost:8000/its/create_quiz',
    API_SaveExam = 'http://localhost:8000/its/save_quiz',
    API_GetExamSetID = 'http://localhost:8000/its/get_quiz_by_Id_only_setquiz',
    API_GetExamForTest = 'http://localhost:8000/its/get_quiz_for_test',
    API_ShowScoreStudent = 'http://localhost:8000/its/get_score_by_user_id',
    API_DeleteExam = 'http://localhost:8000/its/del_quiz',

    //Skill
    API_CreateSkill = 'http://localhost:8000/its/create_skill',
    API_GetSkill = 'http://localhost:8000/its/get_skill',
    API_UpdateSkill = 'http://localhost:8000/its/update_skill',
    API_DeleteSkill = 'http://localhost:8000/its/del_skill',

    //QuizSet
    API_GetQuizSet = 'http://localhost:8000/its/get_quiz_set',
    API_CreateQuizSet = 'http://localhost:8000/its/create_quiz_set',
    API_UpdateQuizSet = 'http://localhost:8000/its/update_quiz_set',
    API_UpdateQuiz = 'http://localhost:8000/its/update_quiz',
    API_GetTimeQuiz = 'http://localhost:8000/its/get_time_quiz',
    API_DeleteQuizSet = 'http://localhost:8000/its/del_quiz_set',

    //TestResults
    API_TotleTestResults = 'http://localhost:8000/its/get_score_total',
    API_TotleTestResultsSchoolID = 'http://localhost:8000/its/get_score_total/school_id',
    API_GetScoreTotalAnswer = 'http://localhost:8000/its/get_score_total_answer',
    API_GetAddressBySchool = 'http://localhost:8000/its/get_address_by_school',

    //TestMode
    API_SaveChoiceTestMode = 'http://localhost:8000/its/create_choice_test_mode',
    API_GetChoiceTestModeAll ='http://localhost:8000/its/get_choice_test_mode_all',
    API_GetChoiceTestModeByID = 'http://localhost:8000/its/get_choice_test_mode_by_id',
    API_UpdateGetChoiceTestMode = 'http://localhost:8000/its/update_choice_test_mode',
    API_GetAnswerScoreTestMode='http://localhost:8000/its/get_answer_score_testmode'
}   