from django.db import models

# Create your models here.
class Role(models.Model):
    class Meta:
        db_table = "role"
    role_name = models.CharField(max_length=55, blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class User(models.Model):
    class Meta:
        db_table = "users"
    user_first_name = models.CharField(max_length=55, blank=True, null=True)
    user_last_name = models.CharField(max_length=55, blank=True, null=True)
    user_gender = models.IntegerField(null=True) #1=male, 2=female
    user_email = models.EmailField(max_length=55, blank=True, null=True)
    user_class = models.TextField(blank=True, null=True)
    user_password = models.CharField(max_length=255, blank=True, null=True)
    user_school_id = models.IntegerField(null=True)
    user_role_id = models.IntegerField(null=True)
    user_question = models.TextField(blank=True, null=True)
    user_answer = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class Token(models.Model):
    class Meta:
        db_table = "tokens"
    token_id = models.AutoField(primary_key=True)
    token_key = models.TextField(blank=True, null=True)
    token_user_id = models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class Schools(models.Model):
    class Meta:
        db_table = "schools"
    school_id = models.AutoField(primary_key=True)
    school_name = models.CharField(max_length=55, blank=True, null=True)
    school_director = models.CharField(max_length=55, blank=True, null=True)
    school_pic_director = models.ImageField(upload_to='school', default='school/no_img.png', null=True, blank=True)
    school_profile_school = models.TextField(blank=True, null=True)
    school_province = models.CharField(max_length=55, blank=True, null=True)
    school_district = models.CharField(max_length=55, blank=True, null=True)
    school_sub_district = models.CharField(max_length=55, blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class SchoolImage(models.Model):
    class Meta:
        db_table = "school_image"
    school_image_id = models.AutoField(primary_key=True)
    school_image_name = models.ImageField(upload_to='school', default='school/no_img.png', null=True, blank=True)
    school_image_school_id = models.IntegerField(null=True)
    school_image_index = models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class Skill(models.Model):
    class Meta:
        db_table = "skills"
    skill_id = models.AutoField(primary_key=True)
    skill_name = models.CharField(max_length=255, blank=True, null=True)
    skill_total_score = models.IntegerField(null=True)
    skill_quantity_per_quiz = models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class Quiz_Set(models.Model):
    class Meta:
        db_table = "quiz_set"
    quiz_set_id = models.AutoField(primary_key=True)
    quiz_set_name = models.CharField(max_length=55, blank=True, null=True)
    quiz_set_time = models.IntegerField(null=True)
    quiz_set_discription = models.TextField(blank=True, null=True)
    quiz_set_skill = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class Quiz(models.Model):
    class Meta:
        db_table = "quiz"
    quiz_id = models.AutoField(primary_key=True)
    quiz_proposition = models.TextField(blank=True, null=True)
    quiz_choice = models.TextField(blank=True, null=True)
    quiz_score = models.FloatField(null=True)
    quiz_score_per_ans = models.FloatField(null=True)
    quiz_skill_id = models.IntegerField(null=True)
    quiz_quiz_set_id = models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)
    image_proposition = models.TextField(blank=True, null=True)
    quiz_subskill = models.TextField(blank=True, null=True)
    sub_exam = models.IntegerField(null=True)

class QuizSave(models.Model):
    class Meta:
        db_table = "quiz_save"
    quiz_save_id = models.AutoField(primary_key=True)
    quiz_save_quiz_id = models.IntegerField(null=True)
    quiz_save_score = models.FloatField(null=True)
    quiz_save_user_id = models.IntegerField(null=True)
    quiz_save_count = models.IntegerField(null=True) #1 = สอบรอบแรก, 2 = สอบรอบสอง
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class TotalScore(models.Model):
    class Meta:
        db_table = "total_score"
    total_score_id = models.AutoField(primary_key=True)
    total_score_percent = models.FloatField(null=True)
    total_score_male = models.FloatField(null=True)
    total_score_female = models.FloatField(null=True)
    total_score_skill_id = models.IntegerField(null=True)
    total_score_school_id = models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now_add=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)

class QuizAndTotelScore(models.Model):
    class Meta:
        db_table = "totel_answer_and_score"
    test_id = models.AutoField(primary_key=True)
    times_test = models.IntegerField(null=True)
    gender_id = models.IntegerField(null=True)
    school_id = models.IntegerField(null=True)
    name =  models.TextField(blank=True, null=True)
    user_id = models.IntegerField(null=True)
    answer_score = models.TextField(blank=True, null=True)
    totel_score = models.TextField(blank=True, null=True)
    class_name = models.TextField(blank=True, null=True)
    quiz_set_id =  models.IntegerField(null=True)
    create_at = models.DateTimeField(auto_now=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)
    
    
class QuizIdSave(models.Model):
    class Meta:
        db_table = "quiz_id_save"
    usiz_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(null=True)
    quiz_set_id = models.IntegerField(null=True)
    quiz_id = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)
    
    
class TestMode(models.Model):
    class Meta:
        db_table = "testmode_chioce"
    test_id = models.AutoField(primary_key=True)
    subject = models.TextField(blank=True, null=True)
    choiceOne = models.TextField(blank=True, null=True)
    choiceTwo = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)
    

class SavedataTest(models.Model):
    class Meta:
        db_table = "testmode_ans"
    test_ans_id = models.AutoField(primary_key=True)
    times_test = models.IntegerField(null=True)
    quiz_set_id = models.IntegerField(null=True)
    data_test_quiz = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now=True, blank=True)
    update_at = models.DateTimeField(auto_now=True, blank=True)
    
