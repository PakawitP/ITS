# Generated by Django 3.0.5 on 2021-01-24 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ITSAPI', '0005_skill'),
    ]

    operations = [
        # migrations.CreateModel(
        #     name='Quiz',
        #     fields=[
        #         ('quiz_id', models.AutoField(primary_key=True, serialize=False)),
        #         ('quiz_proposition', models.TextField(blank=True, null=True)),
        #         ('quiz_choice', models.TextField(blank=True, null=True)),
        #         ('quiz_score', models.FloatField(null=True)),
        #         ('quiz_skill_id', models.IntegerField(null=True)),
        #         ('quiz_quiz_set_id', models.IntegerField(null=True)),
        #         ('create_at', models.DateTimeField(auto_now_add=True)),
        #         ('update_at', models.DateTimeField(auto_now=True)),
        #     ],
        #     options={
        #         'db_table': 'quiz',
        #     },
        # ),
        migrations.CreateModel(
            name='Quiz_Set',
            fields=[
                ('quiz_set_id', models.AutoField(primary_key=True, serialize=False)),
                ('quiz_set_name', models.CharField(blank=True, max_length=55, null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'quiz_set',
            },
        ),
    ]