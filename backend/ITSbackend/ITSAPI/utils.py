import jwt
import hashlib
import uuid
from .models import *
from ITSbackend.settings import *
from datetime import datetime, timedelta
from django.utils import timezone

key = uuid.uuid4().hex
JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 15552000

def date_image():
    date_image = timezone.localtime(timezone.now()).strftime("%Y%m%d%H%M%S%f")
    return  date_image

def encrypt_password(password):
    encoded_cipher_text = hashlib.sha256(key.encode() + password.encode()).hexdigest() + ':' + key
    return encoded_cipher_text

def decrypt_password(password_db, password_login):
    password, key = password_db.split(':')
    return password == hashlib.sha256(key.encode() + password_login.encode()).hexdigest()

def create_jwt_auth(user):
    payload = {
        'user_id': user['user_id'],
        'user_role_id': user['user_role_id'],
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
    token_used = Token.objects.using(db_its).filter(token_user_id=user['user_id']).order_by("token_id")
    if len(token_used) > 0:
        Token.objects.using(db_its).filter(token_id=token_used[0].token_id).delete()
    data = {"token_key":jwt_token, "token_user_id":user['user_id']}
    Token.objects.using(db_its).create(**data)
    return jwt_token

def verify_jwt_auth(request):
    msg_token_invalid = {'msg': False,
                         'Error': "Token invalid", 
                         'status' :"401"
                        }
    if 'HTTP_AUTHORIZATION' in request.META:
        # res = msg_token_invalid
        jwt_token = request.META['HTTP_AUTHORIZATION']
        # print("jwt_token===============>", jwt_token)
        try:
            payload = jwt.decode(jwt_token, JWT_SECRET, JWT_ALGORITHM)
            # print("payload==============>", payload)
            if "user_id" in payload:
                check_user = Token.objects.using(db_its).filter(token_user_id=payload["user_id"])
                if len(check_user) != 0:
                    # print("check_user=========>", check_user)
                    for ch in check_user:
                        # print("bh=======>", ch.token_key)
                        if jwt_token == ch.token_key:
                            # print("ch=====>", ch)
                            res = {
                                "msg": True,
                                "user_id": payload["user_id"],
                                "user_role_id": payload["user_role_id"]
                            }
                            break
                        else:
                            # print("ah====>", ch)
                            res = msg_token_invalid
                else:
                    res = {
                        "msg": False,
                        "data": "Token Invalid"
                    }
        except Exception as error:
            print("error=========>",error)
            res = {
                "msg": False,
                "data": "Token mismatch"
            }
    else:
        res = {
            "msg": False,
            "data": "not found HTTP_AUTHORIZATION"
        }
    return res

def CreateScoreTotal(gender_id, collect_quiz_id, user_id, get_quiz):
    #create score total
    #find skill
    get_skill = Skill.objects.using(db_its).all()
    collect_skill = []
    for skill in get_skill:
        collect_skill.append(skill.skill_id)
    print(f"collect_skill: {collect_skill}")

    #find user school
    get_user = User.objects.using(db_its).get(id=user_id)
    school_id = get_user.user_school_id
    print(f"school_id: {school_id}")

    #find user in school
    if gender_id == 0:
        get_all_user = User.objects.using(db_its).filter(user_school_id=school_id)
    else:
        get_all_user = User.objects.using(db_its).filter(user_school_id=school_id, user_gender=gender_id)
    collect_user_id = []
    for user in get_all_user:
        collect_user_id.append(user.id)
    print(f"collect_user_id: {collect_user_id}")

    #get quiz save by user_id and quiz_id
    get_quiz_save = QuizSave.objects.using(db_its).filter(quiz_save_user_id__in=collect_user_id, quiz_save_quiz_id__in=collect_quiz_id)

    collect_quiz_last = []
    collect_user_last = []
    collect_last = []
    #cal avg score per skill
    for each_skill in collect_skill:
        count_quiz_by_skill = 0
        score_total_per_skill = 0
        avg_score_per_skill = 0
        avg_percent = 0
        for quiz_save in get_quiz_save:
            for each_quizs in get_quiz:
                if (quiz_save.quiz_save_quiz_id == each_quizs.quiz_id) and (each_skill == each_quizs.quiz_skill_id):
                    score_total_per_skill += quiz_save.quiz_save_score
                    data_check = {
                        "quiz_skill": each_skill,
                        "quiz_user": quiz_save.quiz_save_user_id,
                        "quiz_save_count": quiz_save.quiz_save_count
                    }
                    collect_user_last.append(data_check)
        # print(f"collect_user_last: {collect_user_last}")
        for each_check in collect_user_last:
            if each_check not in collect_last:
                collect_last.append(each_check)
            else:
                pass
        count_quiz_by_skill = len(collect_last)
        print(f"collect_last: {collect_last}")
        print(f"count_quiz_by_skill: {count_quiz_by_skill}")
        collect_last = []
        collect_user_last = []
        if count_quiz_by_skill != 0:
            avg_score_per_skill = score_total_per_skill / count_quiz_by_skill
            #cal percent score avg
            if each_skill != 8:
                avg_percent = (avg_score_per_skill * 100) / 2
            else:
                avg_percent = (avg_score_per_skill * 100) / 29
        print(f"skill_id: {each_skill} score_total_per_skill: {score_total_per_skill} count_quiz_by_skill: {count_quiz_by_skill} avg_score_per_skill: {avg_score_per_skill} avg_percent: {avg_percent}")
        # data update total_score_percent
        data_score_total = {
            "total_score_percent": avg_percent,
            "total_score_male": avg_percent,
            "total_score_female": avg_percent,
            "total_score_skill_id": each_skill,
            "total_score_school_id": school_id
        }
        #for gender all
        if gender_id == 0:
            del data_score_total["total_score_male"]
            del data_score_total["total_score_female"]
        #for gender male
        elif gender_id == 1:
            del data_score_total["total_score_percent"]
            del data_score_total["total_score_female"]
        #for gender female
        else:
            del data_score_total["total_score_percent"]
            del data_score_total["total_score_male"]
        update_score_total = TotalScore.objects.using(db_its).filter(total_score_school_id=school_id, total_score_skill_id=each_skill).update(**data_score_total)

    return "success"