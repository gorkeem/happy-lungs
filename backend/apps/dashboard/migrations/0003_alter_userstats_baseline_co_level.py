# Generated by Django 5.1.5 on 2025-02-12 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userstats',
            name='baseline_co_level',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
    ]
