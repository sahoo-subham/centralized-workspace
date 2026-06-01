from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager 

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,email,name,password=None,role='member'):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email,name=name,role = role)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self,email,name,password=None):
        return self.create_user(email,name,password,role='admin')

class User(AbstractBaseUser):
    ROLE_CHOICE = (
        ('admin','Admin'),
        ('team_lead','Team Lead'),
        ('member','Member'),
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20,choices=ROLE_CHOICE,default='member')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email