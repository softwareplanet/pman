# Generated by Django 2.1 on 2019-05-23 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0022_auto_20190521_0839'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeeproject',
            name='is_finished',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='is_finished',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='duration_months',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
