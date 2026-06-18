from rest_framework import generics, status
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(APIView):
    def post(self, request):
        data = request.data.copy()  
        data['password'] = make_password(data['password'])  
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()

        if not user or not check_password(password, user.password):
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist() 
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'If this email exists, a reset link has been sent.'})

        token = default_token_generator.make_token(user)
        uid   = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

        send_mail(
            subject='Password Reset Request',
            message=f'Click the link to reset your password:\n\n{reset_link}',
            from_email='noreply@workspace.com',
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({'message': 'If this email exists, a reset link has been sent.'})


class ResetPasswordView(APIView):
    def post(self, request):
        uid      = request.data.get('uid')
        token    = request.data.get('token')
        password = request.data.get('password')

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user    = User.objects.get(pk=user_id)
        except Exception:
            return Response({'error': 'Invalid link.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Link has expired or is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()

        return Response({'message': 'Password reset successful.'})