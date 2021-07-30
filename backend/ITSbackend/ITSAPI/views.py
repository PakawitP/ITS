from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.base import ContentFile
import datetime
from datetime import date, timedelta, time
import random
from django.utils import timezone
from django.db.models import Q
from ITSbackend.settings import *
from .models import *
from .utils import *
import json
import base64
import io
from PIL import Image
from resizeimage import resizeimage
from bson.binary import Binary
import sys
# from my_app.models import ImageModel, FileModel
domain = ''

# Create your views here.


class CreateRole(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            datarole = {
                "role_name": data["role_name"]
            }
            Role.objects.using(db_its).create(**datarole)

            res = {
                "msg": True,
                "data": True
            }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": False
            }
            return Response(res)


class GetRole(APIView):
    def get(self, request):
        try:
            collect_data = []

            roles = Role.objects.using(db_its).all()
            for role in roles:
                data_role = {
                    "role_id": role.id,
                    "role_name": role.role_name,
                    "create": (role.create_at + timedelta(hours=7)).strftime('%Y-%m-%d %H:%M:%S')
                }
                collect_data.append(data_role)

            res = {
                "msg": True,
                "data": collect_data
            }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": False
            }
            return Response(res)


class CreateUserITS(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data["user_password"] = encrypt_password(data["user_password"])
            data["user_answer"] = encrypt_password(data["user_answer"])
            data["user_role_id"] = 2

            check_user_email = User.objects.using(db_its).filter(
                user_email=data["user_email"]).exists()
            # if  check_user_email == False:
            if check_user_email == False:
                created_user = User.objects.using(db_its).create(**data)

                get_role = Role.objects.using(db_its).get(
                    id=created_user.user_role_id)
                get_user = {
                    "user_id": created_user.id,
                    "user_first_name": created_user.user_first_name,
                    "user_last_name": created_user.user_last_name,
                    "user_gender": created_user.user_gender,
                    "user_email": created_user.user_email,
                    "user_class": created_user.user_class,
                    "user_school_id": created_user.user_school_id,
                    "user_role_id": created_user.user_role_id,
                    "user_role_name": get_role.role_name
                }
                res = {
                    "msg": True,
                    "data": get_user
                }
            else:
                res = {
                    "msg": False,
                    "data": "Duplicate email"
                }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": "Error Create User"
            }
            return Response(res)


class LoginITS(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data_email = data["user_email"]
            data_password = data["user_password"]

            try:
                find_user = User.objects.using(
                    db_its).get(user_email=data_email)
                find_role = Role.objects.using(
                    db_its).get(id=find_user.user_role_id)
                # find_school = Schools.objects.using(db_its).get(id=find_user.user_school_id)
                password_db = find_user.user_password
                password_encrypt = decrypt_password(password_db, data_password)
                if password_encrypt:
                    user_auth = {
                        "user_id": find_user.id,
                        "user_role_id": find_user.user_role_id
                    }
                    user = {
                        "user_id": find_user.id,
                        "user_first_name": find_user.user_first_name,
                        "user_last_name": find_user.user_last_name,
                        "user_gender": find_user.user_gender,
                        "user_class": find_user.user_class,
                        "user_email": find_user.user_email,
                        "user_school_id": find_user.user_school_id,
                        "user_role_id": find_user.user_role_id,
                        "user_role_name": find_role.role_name,
                        "token": create_jwt_auth(user_auth)
                    }
                    res = {
                        "msg": True,
                        "data": user
                    }
                else:
                    res = {
                        "msg": False,
                        "data": "Password Invalid"
                    }

            except Exception as a:
                print("Error ------> ", a)
                res = {
                    "msg": False,
                    "data": "Email Not Found"
                }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": "Error Login"
            }
            return Response(res)


class CreateSchool(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            print(f"user_id =====> {user_id}")

            data = request.data
            collect_school_image_last = []
            collect_school_image = data["collect_school_image"]
            del data["collect_school_image"]

            try:
                if "school_pic_director" in data:
                    # print("stay if ========>")
                    if data["school_pic_director"] != None:

                        image_64_encode = data["school_pic_director"]
                        format, imgstr = image_64_encode.split(';base64,')
                        image_ascii = imgstr.encode("ascii")
                        decoded = base64.decodebytes(image_ascii)
                        raw_img_io = io.BytesIO(decoded)
                        img = Image.open(raw_img_io)
                        w, h = img.size

                        try:
                            # print("stay try")
                            img = resizeimage.resize_height(img, 110)
                        except:
                            # print("stay execpt")
                            img = Image.open(raw_img_io)
                        if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                            img = img.convert('RGB')

                            # print("test----->")
                        img_io = io.BytesIO()
                        img.save(img_io, format.split("/")[1], quality=60)
                        img_b64 = base64.b64encode(img_io.getvalue())
                        save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                        data["school_pic_director"] = save_img

                    else:
                        # print("stay else ========>")
                        del data["school_pic_director"]
            except Exception as a:
                print(f"error is ========> {a}")
                # print("stay except ========>")
                del data["school_pic_director"]

            school = Schools.objects.using(db_its).create(**data)
            new_school_id = school.school_id

            # create school image
            if len(collect_school_image) > 0:
                for index, image in enumerate(collect_school_image, start=1):
                    if image["school_image_name"] != None:

                        image_64_encode = image["school_image_name"]
                        format, imgstr = image_64_encode.split(';base64,')
                        image_ascii = imgstr.encode("ascii")
                        decoded = base64.decodebytes(image_ascii)
                        raw_img_io = io.BytesIO(decoded)
                        img = Image.open(raw_img_io)
                        w, h = img.size

                        try:
                            img = resizeimage.resize_height(img, h/2)
                        except:
                            img = Image.open(raw_img_io)
                        if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                            img = img.convert('RGB')

                            # print("test----->")
                        img_io = io.BytesIO()
                        img.save(img_io, format.split("/")[1], quality=60)
                        img_b64 = base64.b64encode(img_io.getvalue())
                        save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                        image["school_image_name"] = save_img

                        data_image = {
                            "school_image_name": image["school_image_name"],
                            "school_image_school_id": new_school_id,
                            "school_image_index": index
                        }

                        create_image = SchoolImage.objects.using(
                            db_its).create(**data_image)

                        data_image_last = {
                            "school_image_id": create_image.school_image_id,
                            "school_image_name": str(create_image.school_image_name),
                            "school_image_school_id": create_image.school_image_school_id,
                            "school_image_index": create_image.school_image_index
                        }
                        collect_school_image_last.append(data_image_last)

            data_school = {
                "school_id": school.school_id,
                "school_name": school.school_name,
                "school_director": school.school_director,
                "school_pic_director": str(school.school_pic_director),
                "school_profile_school": school.school_profile_school,
                "school_province": school.school_province,
                "school_district": school.school_district,
                "school_sub_district": school.school_sub_district,
                "school_image": collect_school_image_last
            }

            res = {
                "msg": True,
                "data": data_school
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error create school"
            }
            return Response(res)


class UpdateSchool(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data
            collect_school_image = data["collect_school_image"] if "collect_school_image" in data else None
            if "collect_school_image" in data:
                del data["collect_school_image"]
            else:
                pass
            school_id = data["school_id"]
            del data["school_id"]
            get_school = Schools.objects.using(db_its).get(school_id=school_id)
            try:
                if "school_pic_director" in data:
                    if data["school_pic_director"] != None:

                        image_64_encode = data["school_pic_director"]
                        format, imgstr = image_64_encode.split(';base64,')
                        image_ascii = imgstr.encode("ascii")
                        decoded = base64.decodebytes(image_ascii)
                        raw_img_io = io.BytesIO(decoded)
                        img = Image.open(raw_img_io)
                        w, h = img.size

                        try:

                            img = resizeimage.resize_height(img, 110)
                        except:

                            img = Image.open(raw_img_io)
                        if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                            img = img.convert('RGB')

                            # print("test----->")
                        img_io = io.BytesIO()
                        img.save(img_io, format.split("/")[1], quality=60)
                        img_b64 = base64.b64encode(img_io.getvalue())
                        save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                        data["school_pic_director"] = save_img

                        get_school.school_pic_director = data["school_pic_director"]
                        get_school.save()
                        del data["school_pic_director"]
                    else:
                        del data["school_pic_director"]
            except:
                data["school_pic_director"] = image_64_encode
            update_school = Schools.objects.using(db_its).filter(
                school_id=school_id).update(**data)

            collect_school_image_id = []
            if collect_school_image != None:
                if len(collect_school_image) > 0:

                    for index, image in enumerate(collect_school_image, start=1):
                        try:
                            if "school_image_id" not in image:

                                image_64_encode = image["school_image_name"]
                                format, imgstr = image_64_encode.split(
                                    ';base64,')
                                image_ascii = imgstr.encode("ascii")
                                decoded = base64.decodebytes(image_ascii)
                                raw_img_io = io.BytesIO(decoded)
                                img = Image.open(raw_img_io)
                                w, h = img.size

                                try:

                                    img = resizeimage.resize_height(img, h/2)
                                except:

                                    img = Image.open(raw_img_io)
                                if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                                    img = img.convert('RGB')

                                    # print("test----->")
                                img_io = io.BytesIO()
                                img.save(img_io, format.split(
                                    "/")[1], quality=60)
                                img_b64 = base64.b64encode(img_io.getvalue())
                                save_img = "data:image/png;base64," + \
                                    str(img_b64)[2:-1]
                                image["school_image_name"] = save_img

                                data_image = {
                                    "school_image_name": image["school_image_name"],
                                    "school_image_school_id": school_id,
                                    "school_image_index": index
                                }
                                create_image = SchoolImage.objects.using(
                                    db_its).create(**data_image)
                                collect_school_image_id.append(
                                    create_image.school_image_id)
                            else:
                                collect_school_image_id.append(
                                    image["school_image_id"])
                        except:
                            pass
                            # re_image = data["school_image_name"].replace(str(domain),"")
                            # data_image["school_image_name"] = re_image
                    delete_school_image = SchoolImage.objects.using(db_its).filter(
                        ~Q(school_image_id__in=collect_school_image_id), school_image_school_id=school_id).delete()
                else:
                    delete_school_image = SchoolImage.objects.using(
                        db_its).filter(school_image_school_id=school_id).delete()

            res = {
                "msg": True,
                "data": "Updated"
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Update School"
            }
            return Response(res)


class GetSchoolForGuest(APIView):

    def get(self, request):
        try:

            collect_school = []
            collect_school_image = []
            collect_school_image_last = []

            # school image
            school_images = SchoolImage.objects.using(db_its).all()
            for school_image in school_images:
                data_school_image = {
                    "school_image_id": school_image.school_image_id,
                    "school_image_name": str(school_image.school_image_name),
                    "school_image_school_id": school_image.school_image_school_id
                }
                collect_school_image.append(data_school_image)

            # get all school
            schools = Schools.objects.using(db_its).all()
            for school in schools:
                # find school image
                for each in collect_school_image:
                    if school.school_id == each["school_image_school_id"]:
                        collect_school_image_last.append(each)
                        break

                data_school = {
                    "school_id": school.school_id,
                    "school_name": school.school_name,
                    "school_director": school.school_director,
                    "school_image": collect_school_image_last
                }
                collect_school_image_last = []
                collect_school.append(data_school)
            res = {
                "msg": True,
                "data": collect_school
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get School All"
            }
            return Response(res)


class GetSchoolAll(APIView):
    def get(self, request):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            collect_school = []
            collect_school_image = []
            collect_school_image_last = []

            # school image
            school_images = SchoolImage.objects.using(db_its).all()
            for school_image in school_images:
                data_school_image = {
                    "school_image_id": school_image.school_image_id,
                    "school_image_name":  str(school_image.school_image_name),
                    "school_image_school_id": school_image.school_image_school_id
                }
                collect_school_image.append(data_school_image)

            # get all school
            schools = Schools.objects.using(db_its).all()
            for school in schools:
                # find school image
                for each in collect_school_image:
                    if school.school_id == each["school_image_school_id"]:
                        collect_school_image_last.append(each)

                data_school = {
                    "school_id": school.school_id,
                    "school_name": school.school_name,
                    "school_director": school.school_director,
                    "school_pic_director": str(school.school_pic_director),
                    "school_profile_school": school.school_profile_school,
                    "school_province": school.school_province,
                    "school_district": school.school_district,
                    "school_sub_district": school.school_sub_district,
                    "school_image": collect_school_image_last
                }
                collect_school_image_last = []
                collect_school.append(data_school)
            res = {
                "msg": True,
                "data": collect_school
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get School All"
            }
            return Response(res)


class GetSchoolAllGUEST(APIView):
    def get(self, request):
        try:

            collect_school = []

            # get all school
            schools = Schools.objects.using(db_its).all()
            for school in schools:

                data_school = {
                    "school_id": school.school_id,
                    "school_name": school.school_name,
                }
                # collect_school_image_last = []
                collect_school.append(data_school)
            res = {
                "msg": True,
                "data": collect_school
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get School All"
            }
            return Response(res)


class GetSchoolById(APIView):
    def get(self, request, school_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            collect_school = []
            collect_school_image = []
            collect_school_image_last = []

            # school image
            school_images = SchoolImage.objects.using(db_its).all()
            for school_image in school_images:
                data_school_image = {
                    "school_image_id": school_image.school_image_id,
                    "school_image_name": str(school_image.school_image_name),
                    "school_image_school_id": school_image.school_image_school_id
                }
                collect_school_image.append(data_school_image)

            try:
                # get school
                school = Schools.objects.using(db_its).get(school_id=school_id)
            except:
                res = {
                    "msg": False,
                    "data": "Not Found School"
                }
                return Response(res)

            # find school image
            for each in collect_school_image:
                if school.school_id == each["school_image_school_id"]:
                    collect_school_image_last.append(each)

            data_school = {
                "school_id": school.school_id,
                "school_name": school.school_name,
                "school_director": school.school_director,
                "school_pic_director": str(domain) + str(school.school_pic_director),
                "school_profile_school": school.school_profile_school,
                "school_province": school.school_province,
                "school_district": school.school_district,
                "school_sub_district": school.school_sub_district,
                "school_image": collect_school_image_last
            }
            collect_school_image_last = []
            collect_school.append(data_school)

            res = {
                "msg": True,
                "data": collect_school
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get School By id"
            }
            return Response(res)


class CreateSkill(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            create_skill = Skill.objects.using(db_its).create(**data)
            data_skill = {
                "skill_id": create_skill.skill_id,
                "skill_name": create_skill.skill_name,
                "skill_total_score": create_skill.skill_total_score,
                "skill_quantity_per_quiz": create_skill.skill_quantity_per_quiz
            }

            res = {
                "msg": True,
                "data": data_skill
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Create Skill"
            }
            return Response(res)


class UpdateSkill(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data
            skill_id = data["skill_id"]
            del data["skill_id"]

            update_skill = Skill.objects.using(db_its).filter(
                skill_id=skill_id).update(**data)
            try:
                get_skill = Skill.objects.using(db_its).get(skill_id=skill_id)
                data_skill = {
                    "skill_id": get_skill.skill_id,
                    "skill_name": get_skill.skill_name,
                    "skill_total_score": get_skill.skill_total_score,
                    "skill_quantity_per_quiz": get_skill.skill_quantity_per_quiz
                }

                res = {
                    "msg": True,
                    "data": data_skill
                }
            except:
                res = {
                    "msg": False,
                    "data": "Not Found Skill id"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            raise
            res = {
                "msg": False,
                "data": "Error Update Skill"
            }
            return Response(res)


class GetSkill(APIView):
    def get(self, request):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            collect_skill = []

            skills = Skill.objects.using(db_its).all()
            for skill in skills:
                data_skill = {
                    "skill_id": skill.skill_id,
                    "skill_name": skill.skill_name,
                    "skill_total_score": skill.skill_total_score,
                    "skill_quantity_per_quiz": skill.skill_quantity_per_quiz
                }
                collect_skill.append(data_skill)

            res = {
                "msg": True,
                "data": collect_skill
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Skill"
            }
            return Response(res)


class CreateQuizSet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            data_quiz_set = {
                "quiz_set_name": data["quiz_set_name"],
                "quiz_set_time": data["quiz_set_time"],
                "quiz_set_discription": data["quiz_set_discription"],
                "quiz_set_skill": json.dumps(data["quiz_set_skill"]),

            }

            create_quiz_set = Quiz_Set.objects.using(
                db_its).create(**data_quiz_set)

            res = {
                "msg": True,
                "data": "Create Quiz Set Success"
            }
            return Response(res)
        except Exception as error:
            print("Error", error)
            res = {
                "msg": False,
                "data": "Error Create Quiz Set"
            }
            return Response(res)


class UpdateQuizSet(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            data_quiz_set = {
                "quiz_set_name": data["quiz_set_name"],
                "quiz_set_time": data["quiz_set_time"],
                "quiz_set_discription": data["quiz_set_discription"],
                "quiz_set_skill": json.dumps(data["quiz_set_skill"]),

            }

            quiz_set_id = data["quiz_set_id"]
            del data["quiz_set_id"]

            update_quiz_set = Quiz_Set.objects.using(db_its).filter(
                quiz_set_id=quiz_set_id).update(**data_quiz_set)

            res = {
                "msg": True,
                "data": "Update Quiz Set Success"
            }
            return Response(res)
        except Exception as error:
            res = {
                "msg": False,
                "data": "Error Update Quiz Set"
            }
            return Response(res)


class GetQuizSet(APIView):
    def get(self, request):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            collect_data = []
            get_quiz_sets = Quiz_Set.objects.using(db_its).all()
            for get_quiz_set in get_quiz_sets:
                data_quiz_set = {
                    "quiz_set_id": get_quiz_set.quiz_set_id,
                    "quiz_set_name": get_quiz_set.quiz_set_name,
                    "quiz_set_time": get_quiz_set.quiz_set_time,
                    "quiz_set_discription": get_quiz_set.quiz_set_discription,
                    "quiz_set_skill": json.loads(get_quiz_set.quiz_set_skill),
                }
                collect_data.append(data_quiz_set)

            res = {
                "msg": True,
                "data": collect_data
            }
            return Response(res)
        except Exception as error:
            print('Error', error)
            res = {
                "msg": False,
                "data": "Error Get Quiz Set"
            }
            return Response(res)


class CreateQuiz(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data
            len_choice = len(data["quiz_choice"])
            get_skill = Skill.objects.using(db_its).get(
                skill_id=data["quiz_skill_id"])
            # cal score
            score = get_skill.skill_total_score / get_skill.skill_quantity_per_quiz

            if data["image_proposition"] != None:
                image_64_encode = data["image_proposition"]
                format, imgstr = image_64_encode.split(';base64,')
                image_ascii = imgstr.encode("ascii")
                decoded = base64.decodebytes(image_ascii)
                raw_img_io = io.BytesIO(decoded)
                img = Image.open(raw_img_io)
                w, h = img.size

                try:
                    img = resizeimage.resize_height(img, h*0.85)
                except:
                    img = Image.open(raw_img_io)
                if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                    img = img.convert('RGB')

                    # print("test----->")
                img_io = io.BytesIO()
                img.save(img_io, format.split("/")[1], quality=60)
                img_b64 = base64.b64encode(img_io.getvalue())
                save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                data["image_proposition"] = save_img

            choice_correct = 0
            for index, each_choice in enumerate(data["quiz_choice"]):
                if each_choice["image"] != None:
                    image_64_encode = each_choice["image"]
                    format, imgstr = image_64_encode.split(';base64,')
                    image_ascii = imgstr.encode("ascii")
                    decoded = base64.decodebytes(image_ascii)
                    raw_img_io = io.BytesIO(decoded)
                    img = Image.open(raw_img_io)
                    w, h = img.size
                    try:
                        img = resizeimage.resize_height(img, h*0.8)
                    except:
                        img = Image.open(raw_img_io)
                    if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                        img = img.convert('RGB')
                        # print("test----->")
                    img_io = io.BytesIO()
                    img.save(img_io, format.split("/")[1], quality=60)
                    img_b64 = base64.b64encode(img_io.getvalue())
                    save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                    each_choice["image"] = save_img
                if each_choice["choice_correct"] == True or each_choice["choice_correct"] == False:
                    if each_choice["choice_correct"] == True:
                        choice_correct += 1
                    each_choice["choice_id"] = index
                else:
                    choice_correct = len_choice
                    each_choice["choice_id"] = index
                    each_choice["choice_correct"] = int(
                        each_choice["choice_correct"])
            # print(f"choice_correct: {choice_correct}")

            score_per_choice = score / choice_correct
            # print(f"score_per_choice: {score_per_choice}")

            data_create_quiz = {
                "quiz_proposition": data["quiz_proposition"],
                "quiz_choice": json.dumps(data["quiz_choice"]),
                "image_proposition": data["image_proposition"],
                "quiz_subskill": json.dumps(data["quiz_subskill"]),
                "quiz_score": score,
                "quiz_score_per_ans": score_per_choice,
                "quiz_skill_id": data["quiz_skill_id"],
                "quiz_quiz_set_id": data["quiz_quiz_set_id"],
                "sub_exam": data["sub_exam"]
            }
            create_quiz = Quiz.objects.using(db_its).create(**data_create_quiz)

            res = {
                "msg": True,
                "data": data
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Create Quiz"
            }
            return Response(res)


class UpdateQuiz(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data
            quiz_id = data["quiz_id"]
            del data["quiz_id"]

            if ("quiz_proposition" in data) and ("quiz_choice" in data):
                len_choice = len(data["quiz_choice"])
                get_skill = Skill.objects.using(db_its).get(
                    skill_id=data["quiz_skill_id"])
                # cal score
                score = get_skill.skill_total_score / get_skill.skill_quantity_per_quiz
                if data["image_proposition"] != None:
                    image_64_encode = data["image_proposition"]
                    format, imgstr = image_64_encode.split(';base64,')
                    image_ascii = imgstr.encode("ascii")
                    decoded = base64.decodebytes(image_ascii)
                    raw_img_io = io.BytesIO(decoded)
                    img = Image.open(raw_img_io)
                    w, h = img.size

                    try:
                        img = resizeimage.resize_height(img, h*0.85)
                    except:
                        img = Image.open(raw_img_io)
                    if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                        img = img.convert('RGB')

                        # print("test----->")
                    img_io = io.BytesIO()
                    img.save(img_io, format.split("/")[1], quality=60)
                    img_b64 = base64.b64encode(img_io.getvalue())
                    save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                    data["image_proposition"] = save_img

                choice_correct = 0
                for index, each_choice in enumerate(data["quiz_choice"]):
                    if each_choice["image"] != None:
                        image_64_encode = each_choice["image"]
                        format, imgstr = image_64_encode.split(';base64,')
                        image_ascii = imgstr.encode("ascii")
                        decoded = base64.decodebytes(image_ascii)
                        raw_img_io = io.BytesIO(decoded)
                        img = Image.open(raw_img_io)
                        w, h = img.size
                        try:
                            img = resizeimage.resize_height(img, h*0.8)
                        except:
                            img = Image.open(raw_img_io)
                        if str(format.split("/")[1]) in ['jpg', 'jpeg']:
                            img = img.convert('RGB')
                            # print("test----->")
                        img_io = io.BytesIO()
                        img.save(img_io, format.split("/")[1], quality=60)
                        img_b64 = base64.b64encode(img_io.getvalue())
                        save_img = "data:image/png;base64,"+str(img_b64)[2:-1]
                        each_choice["image"] = save_img
                    if each_choice["choice_correct"] == True or each_choice["choice_correct"] == False:
                        if each_choice["choice_correct"] == True:
                            choice_correct += 1
                        each_choice["choice_id"] = index
                    else:
                        choice_correct = len_choice
                        each_choice["choice_id"] = index
                        each_choice["choice_correct"] = int(
                            each_choice["choice_correct"])

                score_per_choice = score / choice_correct
                data_update_quiz = {
                    "quiz_proposition": data["quiz_proposition"],
                    "quiz_choice": json.dumps(data["quiz_choice"]),
                    "image_proposition": data["image_proposition"],
                    "quiz_skill_id": data["quiz_skill_id"],
                    "quiz_subskill": json.dumps(data["quiz_subskill"]),
                    "quiz_quiz_set_id": data["quiz_quiz_set_id"],
                    "quiz_score_per_ans": score_per_choice,
                    "quiz_score": score,

                }
                update_quiz = Quiz.objects.using(db_its).filter(
                    quiz_id=quiz_id).update(**data_update_quiz)
                get_quiz = Quiz.objects.using(db_its).get(quiz_id=quiz_id)
                data_quiz = {
                    "quiz_id": get_quiz.quiz_id,
                    "quiz_proposition": get_quiz.quiz_proposition,
                    "quiz_choice": json.loads(get_quiz.quiz_choice),
                    "quiz_score": get_quiz.quiz_score,
                    "quiz_score_per_ans": get_quiz.quiz_score_per_ans,
                    "quiz_skill_id": get_quiz.quiz_skill_id,
                    "quiz_quiz_set_id": get_quiz.quiz_quiz_set_id
                }
                res = {
                    "msg": True,
                    "data": data_quiz
                }
            else:
                res = {
                    "msg": True,
                    "data": "data error"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Update Quiz"
            }
            return Response(res)


class GetQuizById(APIView):
    def get(self, request, quiz_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            try:
                quiz = Quiz.objects.using(db_its).get(quiz_id=quiz_id)
                data_quiz = {
                    "quiz_id": quiz.quiz_id,
                    "quiz_proposition": quiz.quiz_proposition,
                    "quiz_choice": json.loads(quiz.quiz_choice),
                    "quiz_score": quiz.quiz_score,
                    "quiz_score_per_ans": quiz.quiz_score_per_ans,
                    "quiz_skill_id": quiz.quiz_skill_id,
                    "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                    "quiz_subskill": json.loads(quiz.quiz_subskill),
                    "image_proposition": quiz.image_proposition,
                    "sub_exam": quiz.sub_exam,

                }

                res = {
                    "msg": True,
                    "data": data_quiz
                }
            except:
                res = {
                    "msg": False,
                    "data": "Not Found Quiz"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Quiz By Id"
            }
            return Response(res)


class QuizAnsSave(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            answer_quiz = {}
            data = request.data
            quiz_set_id = data["quiz_set_id"]
            times_test = 1
            collect_answer_score = []
            score = {}
            times_test = 0
         
            get_quiz = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=quiz_set_id)
            skills = Skill.objects.using(db_its).all()
            totel_quiz__user = QuizIdSave.objects.using(
                db_its).filter(user_id=user_id)
            for skill_t in skills:
                score[skill_t.skill_id] = {"score": 0, "scoreTotel": 0}

            for quiz in get_quiz:
                temp_choice = {}
                temp_subskill = {}
                choice_count = 0
                tc = json.loads(quiz.quiz_choice)
                for choice in tc:
                    if(choice["choice_correct"] == True or type(choice["choice_correct"]) == type(1)):
                        choice_count += 1
                    temp_choice[choice["choice_id"]] = choice["choice_correct"]
                ts = json.loads(quiz.quiz_subskill)
                for skill in ts:
                    try:
                        temp_subskill[skill["skill_id"]
                                      ] = skill["score_percent"]
                    except Exception as error:
                        pass
              
                answer = {
                    "quiz_score_per_ans": quiz.quiz_score_per_ans,
                    "quiz_score": quiz.quiz_score,
                    "quiz_skill_id": quiz.quiz_skill_id,
                    "quiz_subskill": temp_subskill,
                    "quiz_choice": temp_choice,
                    "choice_count": choice_count,
                }

                answer_quiz[quiz.quiz_id] = answer
          
            for user_answer in data["quiz"]:
                answer_correct = answer_quiz[user_answer["quiz_id"]]
                point = 0
                # pointTotel = 0
                for answer in user_answer["choice_id"]:
                    if answer_correct["quiz_choice"][answer] == True and type(answer_correct["quiz_choice"][answer]) == type(True):
                        # print("trueeeeeeeeeeeeeeeeeeeeeeeeee")
                        point += answer_correct["quiz_score_per_ans"]
                        # score[answer_correct["quiz_skill_id"]]["score"] += answer_correct["quiz_score_per_ans"]
                    elif answer_correct["quiz_choice"][answer] == answer and type(answer_correct["quiz_choice"][answer]) == type(1):
                        point += answer_correct["quiz_score_per_ans"]
                        # score[answer_correct["quiz_skill_id"]]["score"] += answer_correct["quiz_score_per_ans"]

                if len(user_answer["choice_id"]) > answer_correct["choice_count"] and len(answer_correct["quiz_choice"]) > len(user_answer["choice_id"]):
                    point = point/len(user_answer["choice_id"])

                if len(answer_correct["quiz_choice"]) <= len(user_answer["choice_id"]):
                    point = 0

                if(len(answer_correct["quiz_subskill"]) > 0):
                    for key in answer_correct["quiz_subskill"]:
                        score[key]["score"] += point * \
                            answer_correct["quiz_subskill"][key]
                        score[key]["scoreTotel"] += answer_correct["quiz_score"] * \
                            answer_correct["quiz_subskill"][key]
                        # print("score",score[key]["scoreTotel"])
                score[answer_correct["quiz_skill_id"]]["score"] += point
                score[answer_correct["quiz_skill_id"]
                      ]["scoreTotel"] += answer_correct["quiz_score"]
                # print("score", score[answer_correct["quiz_skill_id"]]["scoreTotel"])
                # pointTotel = answer_correct["quiz_score"]
                
                collect_answer_score.append(
                    (point/answer_correct["quiz_score"])*100)
            
            collect_skill_score = []
            for id in score:
                if(score[id]["scoreTotel"] <= 0):
                    t_score = {"skill_id": id, "score": 0}
                else:
                    t_score = {
                        "skill_id": id, "score": score[id]["score"]/score[id]["scoreTotel"]*100}
                collect_skill_score.append(t_score)

            if(len(totel_quiz__user) == 0):
                times_test = 1
                data_quiz = {
                    "user_id": request.META['user_id'],
                    "quiz_id": json.dumps(data["totel_quiz"]),
                    "quiz_set_id": data["quiz_set_id"],
                }
                create_id_quiz = QuizIdSave.objects.using(
                    db_its).create(**data_quiz)
            else:
                times_test = 2
          
            if(data["data_test"]):
                ar_test_data = []
                for temp_data in data["data_test"]:

                    if temp_data["choice"] == "choiceOne":
                        t = 1
                    elif temp_data["choice"] == "choiceTwo":
                        t = 2
                    data_db = {
                        "quiz_id": temp_data["quiz_id"],
                        "test_id": temp_data["test_id"],
                        "choice": t
                    }
                    ar_test_data.append(data_db)

                data_test_quiz = {
                    "times_test": times_test,
                    "data_test_quiz": json.dumps(ar_test_data),
                    "quiz_set_id": data["quiz_set_id"],
                }

                create_test_ans = SavedataTest.objects.using(
                    db_its).create(**data_test_quiz)
          
            data = {
                "times_test": times_test,
                "school_id": data["school_id"],
                "name": data["name"],
                "class_name": data["class"],
                "gender_id": data["user_gender"],
                "answer_score": json.dumps(collect_answer_score),
                "totel_score": json.dumps(collect_skill_score),
                "quiz_set_id": data["quiz_set_id"],
                "user_id": request.META['user_id'],
            }
            
            create_score = QuizAndTotelScore.objects.using(
                db_its).create(**data)
        
            res = {
                "msg": True,
                "data": "save law"
            }
           
            return Response(res)
        except Exception as error:
            print(f"Error is:", error)
            res = {
                "msg": False,
                "data": "Error Save Quiz"
            }
            return Response(res)


class GetScoreTotal(APIView):
    def get(self, request):
        try:
            get_score_total = TotalScore.objects.using(db_its).all()
            get_skill = Skill.objects.using(db_its).all()
            count_school = Schools.objects.using(db_its).all().count()

            collect_data_last = []

            for skill in get_skill:
                total_score = 0
                total_score_male = 0
                total_score_female = 0
                avg_total_score = 0
                avg_total_score_male_per_skill = 0
                avg_total_score_female_per_skill = 0
                for score_total in get_score_total:
                    if skill.skill_id == score_total.total_score_skill_id:
                        total_score += score_total.total_score_percent
                        total_score_male += score_total.total_score_male
                        total_score_female += score_total.total_score_female
                # cal avg score all school
                avg_total_score_per_skill = total_score / count_school
                avg_total_score_male_per_skill = total_score_male / count_school
                avg_total_score_female_per_skill = total_score_female / count_school
                data_last = {
                    "skill_id": skill.skill_id,
                    "total_score": avg_total_score_per_skill,
                    "total_score_male": avg_total_score_male_per_skill,
                    "total_score_female": avg_total_score_female_per_skill
                }
                collect_data_last.append(data_last)

            res = {
                "msg": True,
                "data": collect_data_last
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Score Total"
            }
            return Response(res)


class GetScoreTotalBySchoolID(APIView):
    def get(self, request, school_id):
        try:
            # filter by school id
            get_score_total = TotalScore.objects.using(
                db_its).filter(total_score_school_id=school_id)
            get_skill = Skill.objects.using(db_its).all()

            collect_data_last = []

            for skill in get_skill:
                total_score = 0
                total_score_male = 0
                total_score_female = 0
                for score_total in get_score_total:
                    if skill.skill_id == score_total.total_score_skill_id:
                        total_score = score_total.total_score_percent
                        total_score_male = score_total.total_score_male
                        total_score_female = score_total.total_score_female
                data_last = {
                    "skill_id": skill.skill_id,
                    "total_score": total_score,
                    "total_score_male": total_score_male,
                    "total_score_female": total_score_female
                }
                collect_data_last.append(data_last)

            res = {
                "msg": True,
                "data": collect_data_last
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Score Total By School_id"
            }
            return Response(res)


class GetAnswerScoreTotal(APIView):
    def get(self, request):
        try:
            get_totel_answer_and_score = QuizAndTotelScore.objects.using(
                db_its).all()
            skills = Skill.objects.using(db_its).all()

            data_score_set = []
            collect_skill = []
            for x in get_totel_answer_and_score:
                score = json.loads(x.totel_score)
                quiz = []

                for j in score:
                    quiz.append(j)

                data_quiz = {
                    "test_id": x.test_id,
                    "times_test": x.times_test,
                    "school_id": x.school_id,
                    "user_id": x.user_id,
                    "name": x.name,
                    "gender_id": x.gender_id,
                    "quiz_score": quiz,
                }
                data_score_set.append(data_quiz)

            for skill in skills:
                data_skill = {
                    "skill_id": skill.skill_id,
                    "skill_name": skill.skill_name,
                    "skill_total_score": skill.skill_total_score,
                    "skill_quantity_per_quiz": skill.skill_quantity_per_quiz
                }
                collect_skill.append(data_skill)

            res = {
                "msg": True,
                "data": {
                    "data": data_score_set,
                    "skill": collect_skill
                }
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Score Total"
            }
            return Response(res)


class GetScoreBySchool(APIView):
    def get(self, request, school_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            try:
                skills = Skill.objects.using(db_its).all()
                totel_score_school = QuizAndTotelScore.objects.using(
                    db_its).filter(school_id=school_id)
                data_score_set = []
                collect_skill = []

                for x in totel_score_school:
                    score = json.loads(x.totel_score)
                    quiz = []

                    for j in score:
                        quiz.append(j)

                    data_quiz = {
                        "test_id": x.test_id,
                        "times_test": x.times_test,
                        "school_id": x.school_id,
                        "user_id": x.user_id,
                        "name": x.name,
                        "gender_id": x.gender_id,
                        "quiz_score": quiz,
                        "answer_score": x.answer_score
                    }
                    data_score_set.append(data_quiz)

                for skill in skills:
                    data_skill = {
                        "skill_id": skill.skill_id,
                        "skill_name": skill.skill_name,
                        "skill_total_score": skill.skill_total_score,
                        "skill_quantity_per_quiz": skill.skill_quantity_per_quiz
                    }
                    collect_skill.append(data_skill)

                    res = {
                        "msg": True,
                        "data": {
                            "data": data_score_set,
                            "skill": collect_skill
                        }
                    }
            except:
                res = {
                    "msg": False,
                    "data": "Not Found Data"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Data"
            }
            return Response(res)


class GetScoreByUserName(APIView):
    def get(self, request, user_idt):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            try:
                skills = Skill.objects.using(db_its).all()
                totel_score = QuizAndTotelScore.objects.using(
                    db_its).filter(user_id=user_idt)
                data_score_set = []
                collect_skill = []

                for x in totel_score:
                    score = json.loads(x.totel_score)
                    quiz = []

                    for j in score:
                        quiz.append(j)

                    data_quiz = {
                        "test_id": x.test_id,
                        "times_test": x.times_test,
                        "school_id": x.school_id,
                        "user_id": x.user_id,
                        "name": x.name,
                        "gender_id": x.gender_id,
                        "answer_score": json.loads(x.answer_score),
                        "quiz_score": quiz,
                    }

                    data_score_set.append(data_quiz)

                for skill in skills:
                    data_skill = {
                        "skill_id": skill.skill_id,
                        "skill_name": skill.skill_name,
                        "skill_total_score": skill.skill_total_score,
                        "skill_quantity_per_quiz": skill.skill_quantity_per_quiz
                    }
                    collect_skill.append(data_skill)

                    res = {
                        "msg": True,
                        "data": {
                            "data": data_score_set,
                            "skill": collect_skill
                        }
                    }
            except:
                res = {
                    "msg": False,
                    "data": "Not Found Data"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Data"
            }
            return Response(res)


class GetAddressSchool(APIView):
    def get(self, request):
        try:
            school_province = ["ทั้งหมด"]
            dic_province = {"ทั้งหมด": []}
            collect_school = []
            school_data = []

            schools = Schools.objects.using(db_its).all()
            for school in schools:

                data_school = {
                    "school_id": school.school_id,
                    "school_name": school.school_name,
                }
                dic_province["ทั้งหมด"].append(data_school)
                try:
                    address = {
                        "school_id": school.school_id,
                        "school_name": school.school_name,
                    }
                    dic_province[school.school_province].append(address)

                except Exception as error:
                    address = {
                        "school_id": school.school_id,
                        "school_name": school.school_name,
                    }
                    dic_province[school.school_province] = []
                    dic_province[school.school_province].append(address)
                    school_province.append(school.school_province)

                # collect_school.append(data_school)

            for i in range(len(school_province)):
                # print(school_province[i])
                data = {
                    "province_id": i,
                    "province_name": school_province[i],
                    "data_school":  dic_province[school_province[i]]
                }
                school_data.append(data)
            # print(dic_province)
            res = {
                "msg": True,
                "data": school_data
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get School All"
            }
            return Response(res)


class GetQuizByIdOnlySetQuiz(APIView):
    def get(self, request, quiz_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            try:
                quiz = Quiz.objects.using(db_its).get(quiz_id=quiz_id)
                data_quiz = {
                    "quiz_id": quiz.quiz_id,
                    "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                }

                res = {
                    "msg": True,
                    "data": data_quiz
                }
            except:
                res = {
                    "msg": False,
                    "data": "Not Found Quiz"
                }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Quiz By Id"
            }
            return Response(res)


class GetQuizBySetId(APIView):
    def get(self, request, quiz_set_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")
            i = 0
            collect_quiz = []
            dic_qiuz = []
            dic_sub_qiuz = {}

            quizs = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=quiz_set_id)

            Quiz_P = Quiz_Set.objects.using(
                db_its).get(quiz_set_id=quiz_set_id)

            sub_quizs = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=None)

            dis_quiz_set = {
                "quiz_set_discription": Quiz_P.quiz_set_discription,
                "quiz_set_time": Quiz_P.quiz_set_time
            }

            for quiz in quizs:
                data_quiz = {
                    "quiz_id": quiz.quiz_id,
                    "quiz_proposition": quiz.quiz_proposition,
                    "quiz_choice": json.loads(quiz.quiz_choice),
                    "quiz_score": quiz.quiz_score,
                    "quiz_score_per_ans": quiz.quiz_score_per_ans,
                    "quiz_skill_id": quiz.quiz_skill_id,
                    "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                    "quiz_subskill": quiz.quiz_subskill,
                    "image_proposition": quiz.image_proposition,
                    # "quiz.sub_exam":quiz.sub_exam
                }
                if(quiz.sub_exam == None):
                    dic_qiuz.append(data_quiz)
                else:
                    try:
                        dic_sub_qiuz[quiz.sub_exam].append(data_quiz)
                    except Exception as error:
                        dic_sub_qiuz[quiz.sub_exam] = []
                        dic_sub_qiuz[quiz.sub_exam].append(data_quiz)

            for sub in sub_quizs:
                data_sub = {
                    "quiz_id": sub.quiz_id,
                    "quiz_proposition": sub.quiz_proposition,
                    "quiz_choice": json.loads(sub.quiz_choice),
                    "quiz_score": sub.quiz_score,
                    "quiz_score_per_ans": sub.quiz_score_per_ans,
                    "quiz_skill_id": sub.quiz_skill_id,
                    "quiz_quiz_set_id": sub.quiz_quiz_set_id,
                    "quiz_subskill": sub.quiz_subskill,
                    "image_proposition": sub.image_proposition,
                }
                try:
                    dic_sub_qiuz[sub.sub_exam].append(data_sub)
                except Exception as error:
                    dic_sub_qiuz[sub.sub_exam] = []
                    dic_sub_qiuz[sub.sub_exam].append(data_sub)

            for quiz in dic_qiuz:
                i += 1

                quiz["quiz_point"] = str(i)
                collect_quiz.append(quiz)
                try:
                    sub_point = 0
                    for sub_quiz in dic_sub_qiuz[quiz["quiz_id"]]:
                        sub_point += 1
                        sub_quiz["quiz_point"] = str(
                            quiz["quiz_point"]) + "." + str(sub_point)
                        collect_quiz.append(sub_quiz)

                        try:
                            sub_sub_point = 0
                            for sub_sub_quiz in dic_sub_qiuz[sub_quiz["quiz_id"]]:
                                sub_sub_point += 1
                                sub_sub_quiz["quiz_point"] = str(
                                    quiz["quiz_point"]) + "." + str(sub_point)+"."+str(sub_sub_point)
                                collect_quiz.append(sub_sub_quiz)

                        except Exception as error:
                            pass
                            # print("None Sub to Sub  Quiz")
                except Exception as error:
                    pass
                    # print("None Sub Quiz")

            res = {
                "msg": True,
                "data": collect_quiz,
                "dis_quiz_set": dis_quiz_set,
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Quiz"
            }
            return Response(res)


class GetQuizForTest(APIView):
    def get(self, request, quiz_set_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")
            # print("type", type(user_id))
            i = 0
            collect_quiz = []
            dic_qiuz = []

            dic_quiz_skill = {}
            dic_sub_qiuz = {}

            dic_quiz_user = {}
            dic_qiuz_set = {}

            # random_quiz = 1
            setQ = True

            quiz_user_test = QuizIdSave.objects.using(
                db_its).filter(user_id=user_id)

            if len(quiz_user_test) > 0:

                quizs = Quiz.objects.using(db_its).filter(
                    quiz_quiz_set_id=quiz_user_test[0].quiz_set_id)
                Quiz_P = Quiz_Set.objects.using(db_its).get(
                    quiz_set_id=quiz_user_test[0].quiz_set_id)

                setQ = False
            else:
                quizs = Quiz.objects.using(db_its).filter(
                    quiz_quiz_set_id=quiz_set_id)
                Quiz_P = Quiz_Set.objects.using(
                    db_its).get(quiz_set_id=quiz_set_id)

            sub_quizs = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=None)

            dis_quiz_set = {
                "quiz_set_discription": Quiz_P.quiz_set_discription,
                "quiz_set_time": Quiz_P.quiz_set_time
            }

            if setQ == True:
                for quiz in quizs:
                    data_quiz = {
                        "quiz_id": quiz.quiz_id,
                        "quiz_proposition": quiz.quiz_proposition,
                        "quiz_choice": json.loads(quiz.quiz_choice),
                        "quiz_score": quiz.quiz_score,
                        "quiz_score_per_ans": quiz.quiz_score_per_ans,
                        "quiz_skill_id": quiz.quiz_skill_id,
                        "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                        "quiz_subskill": quiz.quiz_subskill,
                        "image_proposition": quiz.image_proposition,
                        # "quiz.sub_exam":quiz.sub_exam
                    }
                    if(quiz.sub_exam == None):
                        # dic_qiuz.append(data_quiz)
                        try:
                            dic_quiz_skill[quiz.quiz_skill_id].append(
                                data_quiz)
                        except Exception as error:
                            dic_quiz_skill[quiz.quiz_skill_id] = []
                            dic_quiz_skill[quiz.quiz_skill_id].append(
                                data_quiz)
                    else:
                        try:
                            dic_sub_qiuz[quiz.sub_exam].append(data_quiz)
                        except Exception as error:
                            dic_sub_qiuz[quiz.sub_exam] = []
                            dic_sub_qiuz[quiz.sub_exam].append(data_quiz)

                for sub in sub_quizs:
                    data_sub = {
                        "quiz_id": sub.quiz_id,
                        "quiz_proposition": sub.quiz_proposition,
                        "quiz_choice": json.loads(sub.quiz_choice),
                        "quiz_score": sub.quiz_score,
                        "quiz_score_per_ans": sub.quiz_score_per_ans,
                        "quiz_skill_id": sub.quiz_skill_id,
                        "quiz_quiz_set_id": sub.quiz_quiz_set_id,
                        "quiz_subskill": sub.quiz_subskill,
                        "image_proposition": sub.image_proposition,
                        # "quiz.sub_exam":quiz.sub_exam
                    }
                    try:
                        dic_sub_qiuz[sub.sub_exam].append(data_sub)
                    except Exception as error:
                        dic_sub_qiuz[sub.sub_exam] = []
                        dic_sub_qiuz[sub.sub_exam].append(data_sub)

                for z in json.loads(Quiz_P.quiz_set_skill):
                    dic_qiuz_set[z["skill_id"]] = z["skill_of_point"]

                for key_quiz, value_quiz in dic_quiz_skill.items():
                    tempSpp = dic_qiuz_set[key_quiz]
                    # print("random",tempSpp)
                    for j in range(0, tempSpp, 1):
                        i += 1
                        try:
                            ran_quiz = random.randint(
                                0, len(dic_quiz_skill[key_quiz])-1)

                            temp_quiz = dic_quiz_skill[key_quiz][ran_quiz]
                            dic_qiuz.append(temp_quiz["quiz_id"])
                            temp_quiz["quiz_point"] = str(i)
                            collect_quiz.append(temp_quiz)

                            try:
                                sub_point = 0
                                for sub_quiz in dic_sub_qiuz[temp_quiz["quiz_id"]]:
                                    sub_point += 1
                                    sub_quiz["quiz_point"] = str(
                                        temp_quiz["quiz_point"]) + "." + str(sub_point)
                                    collect_quiz.append(sub_quiz)
                                    try:
                                        sub_sub_point = 0
                                        for sub_sub_quiz in dic_sub_qiuz[sub_quiz["quiz_id"]]:
                                            sub_sub_point += 1
                                            sub_sub_quiz["quiz_point"] = str(
                                                temp_quiz["quiz_point"]) + "." + str(sub_point)+"."+str(sub_sub_point)
                                            collect_quiz.append(sub_sub_quiz)

                                    except Exception as error:
                                        # print("None Sub to Sub  Quiz")
                                        pass
                            except Exception as error:
                                # print("error", error)
                                pass
                            del dic_quiz_skill[key_quiz][ran_quiz]
                        except Exception as error:
                            # print("error", error)
                            pass

            else:
                for quiz in quizs:
                    data_quiz = {
                        "quiz_id": quiz.quiz_id,
                        "quiz_proposition": quiz.quiz_proposition,
                        "quiz_choice": json.loads(quiz.quiz_choice),
                        "quiz_score": quiz.quiz_score,
                        "quiz_score_per_ans": quiz.quiz_score_per_ans,
                        "quiz_skill_id": quiz.quiz_skill_id,
                        "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                        "quiz_subskill": quiz.quiz_subskill,
                        "image_proposition": quiz.image_proposition,
                        # "quiz.sub_exam":quiz.sub_exam
                    }
                    if(quiz.sub_exam == None):
                        dic_qiuz.append(data_quiz)
                        dic_quiz_user[quiz.quiz_id] = data_quiz
                        # try:

                        # except Exception as error:
                        #     dic_quiz_skill[quiz.quiz_skill_id] = []
                        #     dic_quiz_skill[quiz.quiz_skill_id].append(data_quiz)
                    else:
                        # dic_sub_qiuz_user[quiz.quiz_id] = data_quiz
                        try:

                            dic_sub_qiuz[quiz.sub_exam].append(data_quiz)
                        except Exception as error:
                            dic_sub_qiuz[quiz.sub_exam] = []
                            dic_sub_qiuz[quiz.sub_exam].append(data_quiz)

                for sub in sub_quizs:
                    data_sub = {
                        "quiz_id": sub.quiz_id,
                        "quiz_proposition": sub.quiz_proposition,
                        "quiz_choice": json.loads(sub.quiz_choice),
                        "quiz_score": sub.quiz_score,
                        "quiz_score_per_ans": sub.quiz_score_per_ans,
                        "quiz_skill_id": sub.quiz_skill_id,
                        "quiz_quiz_set_id": sub.quiz_quiz_set_id,
                        "quiz_subskill": sub.quiz_subskill,
                        "image_proposition": sub.image_proposition,
                        # "quiz.sub_exam":quiz.sub_exam
                    }
                    try:
                        dic_sub_qiuz[sub.sub_exam].append(data_sub)
                    except Exception as error:
                        dic_sub_qiuz[sub.sub_exam] = []
                        dic_sub_qiuz[sub.sub_exam].append(data_sub)

                for j in json.loads(quiz_user_test[0].quiz_id):
                    i += 1
                    try:

                        temp_quiz = dic_quiz_user[j]
                        # dic_qiuz.append(temp_quiz["quiz_id"])
                        temp_quiz["quiz_point"] = str(i)
                        collect_quiz.append(temp_quiz)

                        try:
                            sub_point = 0
                            for sub_quiz in dic_sub_qiuz[temp_quiz["quiz_id"]]:
                                sub_point += 1
                                sub_quiz["quiz_point"] = str(
                                    temp_quiz["quiz_point"]) + "." + str(sub_point)
                                collect_quiz.append(sub_quiz)
                                try:
                                    sub_sub_point = 0
                                    for sub_sub_quiz in dic_sub_qiuz[sub_quiz["quiz_id"]]:
                                        sub_sub_point += 1
                                        sub_sub_quiz["quiz_point"] = str(
                                            temp_quiz["quiz_point"]) + "." + str(sub_point)+"."+str(sub_sub_point)
                                        collect_quiz.append(sub_sub_quiz)

                                except Exception as error:
                                    # print("None Sub to Sub  Quiz")
                                    pass
                        except Exception as error:
                            # print("error", error)
                            pass
                        # del dic_quiz_skill[key_quiz][ran_quiz]
                    except Exception as error:
                        # print("error", error)
                        pass

            res = {
                "msg": True,
                "data": collect_quiz,
                "dis_quiz_set": dis_quiz_set,
                "totel_id_quiz": dic_qiuz,
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Quiz"
            }
            return Response(res)


class GetTimeQuiz(APIView):
    def get(self, request):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']

            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            quiz_set_id = QuizAndTotelScore.objects.using(
                db_its).filter(user_id=request.META['user_id'])

            if(len(quiz_set_id) > 0):
                quiz_set = quiz_set_id[0].quiz_set_id
            else:
                quiz_set = None
            res = {
                "msg": True,
                "data": len(quiz_set_id),
                "quiz_set": quiz_set
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Skill"
            }
            return Response(res)


class ChoiceTestModeSave(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")
            data_testmode = TestMode.objects.using(db_its).all()
            lendata = len(data_testmode)
            data = request.data
            dateT = {
                "test_id": lendata + 1,
                "subject": data["subject"],
                "choiceOne": data["choiceOne"],
                "choiceTwo": data["choiceTwo"],
            }
            create_data_testmode = TestMode.objects.using(
                db_its).create(**dateT)

            res = {
                "msg": True,
                "data": "Create Choice Testmode Success"
            }
            return Response(res)
        except Exception as error:
            print("Error", error)
            res = {
                "msg": False,
                "data": "Error Create Choice Testmode"
            }
            return Response(res)


class GetChoiceTestModeAll(APIView):
    def get(self, request):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']

            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            creact_data = []

            data_testmode = TestMode.objects.using(db_its).all()

            for data in data_testmode:
                dateT = {
                    "test_id": data.test_id,
                    "subject": data.subject,
                    "choiceOne": data.choiceOne,
                    "choiceTwo": data.choiceTwo,
                }
                creact_data.append(dateT)

            res = {
                "msg": True,
                "data": creact_data,
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Data Testmode"
            }
            return Response(res)


class GetChoiceTestModeByID(APIView):
    def get(self, request, test_id):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']

            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            # print("id", test_id)
            data_testmode = TestMode.objects.using(db_its).get(test_id=test_id)
            # print("data_testmode", data_testmode)

            dateT = {
                "test_id": data_testmode.test_id,
                "subject": data_testmode.subject,
                "choiceOne": data_testmode.choiceOne,
                "choiceTwo": data_testmode.choiceTwo,
            }

            res = {
                "msg": True,
                "data": dateT,
            }
            return Response(res)
        except Exception as error:
            print(f"Error is: {error}")
            res = {
                "msg": False,
                "data": "Error Get Data Testmode"
            }
            return Response(res)


class UpdateChoiceTestMode(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            data_test_mode = {
                "subject": data["subject"],
                "choiceOne": data["choiceOne"],
                "choiceTwo": data["choiceTwo"],
            }

            test_id = data["test_id"]
            del data["test_id"]

            update_test_mode = TestMode.objects.using(db_its).filter(
                test_id=test_id).update(**data_test_mode)

            res = {
                "msg": True,
                "data": "Update Data Test Mode Success"
            }
            return Response(res)
        except Exception as error:
            res = {
                "msg": False,
                "data": "Error Update Data Test Mode"
            }
            return Response(res)


class GetAnswerScoreTest(APIView):
    def get(self, request, quiz_set_id):
        try:
            get_totel_answer_test = SavedataTest.objects.using(
                db_its).filter(quiz_set_id=quiz_set_id)

            quizs_set = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=quiz_set_id)

            data_testmode = TestMode.objects.using(db_its).all()

            sub_quizs = Quiz.objects.using(db_its).filter(
                quiz_quiz_set_id=None)
            quizs_set = list(quizs_set) + list(sub_quizs)

            dic_qiuz = []
            dic_sub_qiuz = {}
            dic_quiz = {}
            dic_testmode = {}
            collect_quiz = []
            dic_totel = {}
            arr_totel = []
            dic_chioce_test = {}

            i = 0

            for quiz in quizs_set:
                dic_testmode = {}
                for data_test in (data_testmode):

                    dic_testmode[data_test.test_id] = [0, 0]
                    dic_quiz[quiz.quiz_id] = dic_testmode

            for data_totel in data_testmode:
                dic_totel[data_totel.test_id] = [0, 0]
                dat = {
                    "subject": data_totel.subject,
                    "choiceOne": data_totel.choiceOne,
                    "choiceTwo": data_totel.choiceTwo,
                }
                dic_chioce_test[data_totel.test_id] = dat

            # print(dic_chioce_test)

            for answer_test in get_totel_answer_test:
                for data_test_quiz in json.loads(answer_test.data_test_quiz):
                    try:
                        dic_quiz[int(data_test_quiz['quiz_id'])][int(
                            data_test_quiz['test_id'])][int(data_test_quiz['choice'])-1] += 1
                        dic_totel[int(data_test_quiz['test_id'])][int(
                            data_test_quiz['choice'])-1] += 1
                    except Exception as error:
                        print("error", error)

            for key in dic_totel:
                totel = dic_totel[key][0] + dic_totel[key][1]
                if(totel == 0):
                    totel = 1
                ob = {
                    "test_name": dic_chioce_test[key]['subject'],
                    "choiceOne": {
                        "name": dic_chioce_test[key]['choiceOne'],
                        "score": (dic_totel[key][0]/totel)*100
                    },
                    "choiceTwo": {
                        "name": dic_chioce_test[key]['choiceTwo'],
                        "score": (dic_totel[key][1]/totel)*100,
                    }
                }
                arr_totel.append(ob)

            for quiz in quizs_set:
                arrnumTest = []
                for t in dic_quiz[quiz.quiz_id]:
                    totel = dic_quiz[quiz.quiz_id][t][0] + \
                        dic_quiz[quiz.quiz_id][t][1]
                    if(totel == 0):
                        totel = 1

                    ob = {
                        "test_name": dic_chioce_test[t]['subject'],
                        "choiceOne": {
                            "name": dic_chioce_test[t]['choiceOne'],
                            "score": (dic_quiz[quiz.quiz_id][t][0]/totel)*100
                        },
                        "choiceTwo": {
                            "name": dic_chioce_test[t]['choiceTwo'],
                            "score": (dic_quiz[quiz.quiz_id][t][1]/totel)*100,
                        }
                    }
                    arrnumTest.append(ob)

                data_quiz = {
                    "quiz_id": quiz.quiz_id,
                    "quiz_proposition": quiz.quiz_proposition,
                    "quiz_choice": json.loads(quiz.quiz_choice),
                    "quiz_score": quiz.quiz_score,
                    "quiz_score_per_ans": quiz.quiz_score_per_ans,
                    "quiz_skill_id": quiz.quiz_skill_id,
                    "quiz_quiz_set_id": quiz.quiz_quiz_set_id,
                    "quiz_subskill": quiz.quiz_subskill,
                    "image_proposition": quiz.image_proposition,
                    "choice_test": arrnumTest
                    # "quiz.sub_exam":quiz.sub_exam
                }
                if(quiz.sub_exam == None):
                    dic_qiuz.append(data_quiz)
                else:
                    try:
                        dic_sub_qiuz[quiz.sub_exam].append(data_quiz)
                    except Exception as error:
                        dic_sub_qiuz[quiz.sub_exam] = []
                        dic_sub_qiuz[quiz.sub_exam].append(data_quiz)

            for quiz in dic_qiuz:
                i += 1

                quiz["quiz_point"] = str(i)
                collect_quiz.append(quiz)
                try:
                    sub_point = 0
                    for sub_quiz in dic_sub_qiuz[quiz["quiz_id"]]:
                        sub_point += 1
                        sub_quiz["quiz_point"] = str(
                            quiz["quiz_point"]) + "." + str(sub_point)
                        collect_quiz.append(sub_quiz)

                        try:
                            sub_sub_point = 0
                            for sub_sub_quiz in dic_sub_qiuz[sub_quiz["quiz_id"]]:
                                sub_sub_point += 1
                                sub_sub_quiz["quiz_point"] = str(
                                    quiz["quiz_point"]) + "." + str(sub_point)+"."+str(sub_sub_point)
                                collect_quiz.append(sub_sub_quiz)

                        except Exception as error:
                            print("error", error)
                except Exception as error:
                    print("error", error)

            res = {
                "msg": True,
                "data": collect_quiz,
                "totel": arr_totel
            }
            return Response(res)
        except Exception as error:
            print("Error is:", error)
            res = {
                "msg": False,
                "data": "Error Get Score Total"
            }
            return Response(res)


class ResetPassword(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data_email = data["user_email"]
            user_first_name = data["user_first_name"]
            user_last_name = data["user_last_name"]

            # print("user_answer", data)
            try:
                find_user = User.objects.using(
                    db_its).get(user_email=data_email)

                if(find_user.user_first_name == user_first_name and find_user.user_last_name == user_last_name):
                    res = {
                        "msg": True,
                        "data": find_user.user_question
                    }
                else:
                    res = {
                        "msg": False,
                        "data": "Name Invalid"
                    }

            except Exception as a:
                print("Error ------> ", a)
                res = {
                    "msg": False,
                    "data": "Email Not Found"
                }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": "Error Login"
            }
            return Response(res)


class AnsResetPassword(APIView):
    def post(self, request, *args, **kwargs):
        try:

            data = request.data
            data_email = data["user_email"]

            data_password = encrypt_password(data["user_password"])
            data_answer = data["user_answer"]

            find_user = User.objects.using(
                db_its).get(user_email=data_email)

            user_id = find_user.id
            # print('find_user.user_answer', find_user.user_answer)

            ans_encrypt = decrypt_password(find_user.user_answer, data_answer)
            # print('data_answer', ans_encrypt)
            if ans_encrypt:
                data_set = {
                    # "quiz_set_name": data["quiz_set_name"],
                    # "quiz_set_time": data["quiz_set_time"],
                    # "quiz_set_discription": data["quiz_set_discription"],
                    # "quiz_set_skill": json.dumps(data["quiz_set_skill"]),
                    "user_password": data_password

                }

                update_password = User.objects.using(db_its).filter(
                    id=user_id).update(**data_set)

                res = {
                    "msg": True,
                    "data": "Reset Password Success"
                }
            else:
                res = {
                    "msg": False,
                    "data": "wrong answer"
                }
            return Response(res)
        except Exception as error:
            print("error", error)
            res = {
                "msg": False,
                "data": "Error Reset Password"
            }
            return Response(res)


class DeleteQuizSet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            quiz_set_id = data["del_id"]

            update_quiz_set = Quiz_Set.objects.using(
                db_its).filter(quiz_set_id=quiz_set_id).delete()

            res = {
                "msg": True,
                "data": "Delete  Success"
            }
            return Response(res)
        except Exception as error:
            print("error", error)
            res = {
                "msg": False,
                "data": "Error Delete  "
            }
            return Response(res)


class DeleteSkill(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            skill_id = data["del_id"]

            update_skill = Skill.objects.using(
                db_its).filter(skill_id=skill_id).delete()

            res = {
                "msg": True,
                "data": "Delete Success"
            }
            return Response(res)
        except Exception as error:
            print("error", error)
            res = {
                "msg": False,
                "data": "Error Delete  "
            }
            return Response(res)


class DeleteSchool(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data

            school_id = data["del_id"]

            update_school = Schools.objects.using(
                db_its).filter(school_id=school_id).delete()
            delete_school_image = SchoolImage.objects.using(
                db_its).filter(school_image_school_id=school_id).delete()
            res = {
                "msg": True,
                "data": "Delete Success"
            }
            return Response(res)
        except Exception as error:
            print("error", error)
            res = {
                "msg": False,
                "data": "Error Delete  "
            }
            return Response(res)


class DeleteQuiz(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.META['user_id']
            user_role_id = request.META['user_role_id']
            print(f"user_id =====> {user_id}")
            print(f"user_role_id =====> {user_role_id}")

            data = request.data
            temp_sub_quiz = []
            quiz_id = data["del_id"]

            # update_school = Schools.objects.using(
            #     db_its).filter(school_id=school_id).delete()
            # delete_school_image = SchoolImage.objects.using(
            #     db_its).filter(school_image_school_id=school_id).delete()
            # Quiz.objects.using(db_its).get(quiz_id=quiz_id)

            update_quiz = Quiz.objects.using(
                db_its).filter(quiz_id=quiz_id).delete()

            get_quiz = Quiz.objects.using(db_its).filter(sub_exam=quiz_id)
            if len(get_quiz) > 0:
                for quiz in get_quiz:
                    if quiz.sub_exam != None:
                        temp_sub_quiz.append(quiz.sub_exam)
                update_quiz = Quiz.objects.using(
                    db_its).filter(sub_exam=quiz_id).delete()

            if len(temp_sub_quiz) > 0:
                for q_id in temp_sub_quiz:
                    update_quiz = Quiz.objects.using(
                        db_its).filter(sub_exam=q_id).delete()

            res = {
                "msg": True,
                "data": "Delete Success"
            }
            return Response(res)
        except Exception as error:
            print("error", error)
            res = {
                "msg": False,
                "data": "Error Delete  "
            }
            return Response(res)


class UpdateUser(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            user_id = data["user_id"]

            try:
                data_set = {
                    "user_first_name": data["user_first_name"],
                    "user_last_name": data["user_last_name"],
                    "user_gender": data["user_gender"],
                    "user_class": data["user_class"],
                    "user_school_id": data["user_school_id"],
                }

                update_user = User.objects.using(db_its).filter(
                    id=user_id).update(**data_set)

                find_user = User.objects.using(
                    db_its).get(id=user_id)

                find_role = Role.objects.using(
                    db_its).get(id=find_user.user_role_id)

                user_auth = {
                    "user_id": find_user.id,
                    "user_role_id": find_user.user_role_id
                }

                user = {
                    "user_id": find_user.id,
                    "user_first_name": find_user.user_first_name,
                    "user_last_name": find_user.user_last_name,
                    "user_gender": find_user.user_gender,
                    "user_class": find_user.user_class,
                    "user_email": find_user.user_email,
                    "user_school_id": find_user.user_school_id,
                    "user_role_id": find_user.user_role_id,
                    "user_role_name": find_role.role_name,
                    "token": create_jwt_auth(user_auth)
                }
                res = {
                    "msg": True,
                    "data": user
                }

            except Exception as a:
                print("Error ------> ", a)
                res = {
                    "msg": False,
                    "data": "Email Not Found"
                }
            return Response(res)
        except Exception as error:
            print(f"Error =========> {error}")
            res = {
                "msg": False,
                "data": "Error Login"
            }
            return Response(res)
