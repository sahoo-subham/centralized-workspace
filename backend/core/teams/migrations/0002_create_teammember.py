from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0001_initial'),
        ('users', '0001_initial'),  # adjust if your users app has a different initial migration
    ]

    operations = [
        migrations.CreateModel(
            name='TeamMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(max_length=100, blank=True, null=True)),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='teams.team')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
            options={
                'unique_together': {('team', 'user')},
            },
        ),
    ]