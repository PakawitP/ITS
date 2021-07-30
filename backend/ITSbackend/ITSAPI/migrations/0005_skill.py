# Generated by Django 3.0.5 on 2021-01-22 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ITSAPI', '0004_schoolimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('skill_id', models.AutoField(primary_key=True, serialize=False)),
                ('skill_name', models.CharField(blank=True, max_length=255, null=True)),
                ('skill_total_score', models.IntegerField(null=True)),
                ('skill_quantity_per_quiz', models.IntegerField(null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'skills',
            },
        ),
    ]
