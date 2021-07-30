# Generated by Django 3.0.5 on 2021-01-21 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ITSAPI', '0003_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolImage',
            fields=[
                ('school_image_id', models.AutoField(primary_key=True, serialize=False)),
                ('school_image_name', models.ImageField(blank=True, default='school/no_img.png', null=True, upload_to='school')),
                ('school_image_school_id', models.IntegerField(null=True)),
                ('school_image_index', models.IntegerField(null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'school_image',
            },
        ),
    ]