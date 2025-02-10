from rest_framework import serializers
from .models import UserStats
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.hashers import make_password

# Serializer for the UserStats model
class UserStatsSerializer(serializers.ModelSerializer):
    time_since_quit = serializers.SerializerMethodField()
    days_since_quit = serializers.SerializerMethodField()
    money_saved = serializers.SerializerMethodField()
    cigarettes_avoided = serializers.SerializerMethodField()
    current_co_level = serializers.SerializerMethodField()
    get_healing_milestones = serializers.SerializerMethodField()
    
    class Meta:
        model = UserStats
        fields = '__all__'

    def get_time_since_quit(self, obj):
        return obj.time_since_quit
    
    def get_days_since_quit(self, obj):
        return obj.days_since_quit
    
    def get_money_saved(self, obj):
        return obj.money_saved
    
    def get_cigarettes_avoided(self, obj):
        return obj.cigarettes_avoided
    
    def get_current_co_level(self, obj):
        return obj.current_co_level
    
    def get_get_healing_milestones(self, obj):
        return obj.get_healing_milestones()
    
# Serializer for registering a new user
class RegisterSerializer(serializers.ModelSerializer):
    
    # Necessary field for the user to register
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    quit_date = serializers.DateField()
    cigs_per_day = serializers.IntegerField()
    cost_per_pack = serializers.DecimalField(max_digits=6, decimal_places=2)
    cigs_in_pack = serializers.IntegerField()


    class Meta:
        model = get_user_model()
        fields = '__all__'

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    
    def validate_email(self, value):
        value = value.strip()  # Clear spaces
        try:
            validate_email(value)  # Django email validator
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        
        return value

    def validate_username(self, value):
        if get_user_model().objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
    
    def validate_quit_date(self, quit_date):
        if quit_date > timezone.now().date():
            raise serializers.ValidationError("Quit date cannot be in the future")
        return quit_date
    
    def create(self, validated_data):
            with transaction.atomic():  # Rollback if any error occurs
                user = get_user_model().objects.create_user(
                    username=validated_data["username"],
                    email=validated_data["email"],
                    password=make_password(validated_data["password"]) # Hash the password while registering 
                )
                UserStats.objects.create(
                    user=user,
                    quit_date=validated_data["quit_date"],
                    cigs_per_day=validated_data["cigs_per_day"],
                    cost_per_pack=validated_data["cost_per_pack"],
                    cigs_in_pack=validated_data["cigs_in_pack"]
                )
            return user

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    days_since_quit = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'date_joined', 'days_since_quit')

    def get_days_since_quit(self, obj):
        try:
            dashboard_stats = UserStats.objects.get(user=obj)
            return dashboard_stats.days_since_quit
        except UserStats.DoesNotExist:
            return None
        
    def get_username(self, obj):
        return obj.username
    
    def get_date_joined(self, obj):
        return obj.date_joined