# Generated by Django 5.1.6 on 2025-02-23 03:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_auth', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('male', 'Male'), ('female', 'Female')], max_length=10, null=True),
        ),
    ]
