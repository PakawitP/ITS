from ITSbackend.settings import *
from .utils import verify_jwt_auth
from django.http import JsonResponse

class LogMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        try:
            access_value = {
                'log_access_api_api_path':request.path,
                'log_access_api_client_device':request.META['HTTP_USER_AGENT'],
                'log_access_api_api_path':request.method,
            }

            url_user_its = ['/its/create_role',
                       '/its/get_role',
                       '/its/Register',
                       '/its/Login'
            ]

            url_guest_its = ['/its/get_school_guest',
                             '/its/get_school_all_guest',
                             '/its/reset_password',
                             '/its/ans_reset_password',
                             '/its/update_user',
                             ]

            url_auth_admin_its = ['/its/create_school',
                                  '/its/update_school',
                                  '/its/create_skill',
                                  '/its/update_skill',
                                  '/its/get_skill',
                                  '/its/create_quiz_set',
                                  '/its/update_quiz_set',
                                  '/its/create_quiz',
                                  '/its/update_quiz',
                                  '/its/get_quiz/quiz_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                  '/its/create_choice_test_mode',
                                #   '/its/get_choice_test_mode_all',
                                  '/its/get_choice_test_mode_by_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                  '/its/update_choice_test_mode',
                                  '/its/get_answer_score_testmode/'+str([i for i in str(request.path).split('/') if i][-1]),
                                  '/its/del_quiz_set',
                                  '/its/del_skill',
                                  '/its/del_school',  
                                  '/its/del_quiz',
            ]

            url_auth_admin_user_its = ['/its/get_school_all',
                                       '/its/get_school/school_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_quiz_set',
                                       '/its/get_quiz/quiz_set_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_score_total',
                                       '/its/get_score_total/school_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_score_total_answer',
                                       '/its/get_score_by_school_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_score_by_user_id/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_address_by_school',
                                       '/its/get_quiz_by_Id_only_setquiz/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_quiz_for_test/'+str([i for i in str(request.path).split('/') if i][-1]),
                                       '/its/get_time_quiz',
                                       '/its/get_choice_test_mode_all',
            ]

            # print(f"path is: {request.path}")

            if request.path in url_user_its:
                return self.get_response(request)

            elif request.path in url_guest_its:
                return self.get_response(request)

            elif request.path in url_auth_admin_user_its:
                verify = verify_jwt_auth(request)
                if verify["msg"] == True:
                    (request.META).update({'user_id': verify["user_id"], 'user_role_id': verify["user_role_id"]})
                    return self.get_response(request)
                else:
                    res = {
                        "msg": False,
                        "data": "Token mismatch"
                    }
                    return JsonResponse(res)

            elif request.path in url_auth_admin_its:
                verify = verify_jwt_auth(request)
                if verify["msg"] == True and verify["user_role_id"] == 1:
                    (request.META).update({'user_id': verify["user_id"], 'user_role_id': verify["user_role_id"]})
                    return self.get_response(request)
                else:
                    res = {
                        "msg": False,
                        "data": "Token mismatch"
                    }
                    return JsonResponse(res)

            else:
                verify = verify_jwt_auth(request)
                if verify["msg"] == True and verify["user_role_id"] == 2:
                    (request.META).update({'user_id': verify["user_id"], 'user_role_id': verify["user_role_id"]})
                    return self.get_response(request)
                else:
                    res = {
                        "msg": False,
                        "data": "Token mismatch"
                    }
                    return JsonResponse(res)

        except Exception as error:
            print(f"Error is ======> {error}")
            res = {
                "msg": False,
                "data": "Error Server"
            }
            return JsonResponse(res)