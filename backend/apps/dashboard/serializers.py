from rest_framework import serializers
from .models import DashboardStats
from django.contrib.auth.models import User


# Serializer for the DashboardStats model
class DashboardStatsSerializer(serializers.ModelSerializer):
    days_since_quit = serializers.SerializerMethodField()
    money_saved = serializers.SerializerMethodField()
    cigarettes_avoided = serializers.SerializerMethodField()
    current_co_level = serializers.SerializerMethodField()
    get_healing_milestones = serializers.SerializerMethodField()
    
    class Meta:
        model = DashboardStats
        fields = ['id', 'user', 'quit_date', 'money_saved', 'cigs_per_day',
                   'cost_per_pack', 'cigs_in_pack', 'days_since_quit', 'current_co_level', 'get_healing_milestones',
                   'save', 'cigarettes_avoided', 
                   'baseline_co_level', 'created_at', 'updated_at'] 
        
    def get_days_since_quit(self, obj):
        return obj.days_since_quit
    
    def get_money_saved(self, obj):
        return obj.money_saved
    
    def get_cigarettes_avoided(self, obj):
        return obj.cigarettes_avoided
    
    def get_current_co_level(self, obj):
        return obj.current_co_level
    
    def get_healing_milestones(self, obj):
        return obj.get_healing_milestones()
    
    def get_save(self, obj):
        return obj.save()
    
# Serializer for registering a new user
class RegisterSerializer(serializers.ModelSerializer):
    
    # Necessary field for the user to register
    quit_date = serializers.DateField()
    cigs_per_day = serializers.IntegerField()
    cost_per_pack = serializers.DecimalField(max_digits=6, decimal_places=2)
    cigs_in_pack = serializers.IntegerField()


    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'quit_date', 'cigs_per_day', 'cost_per_pack', 'cigs_in_pack']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        # Create the user with a username, email and password
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        
        # Create a DashboardStats object for the user with necessary data
        DashboardStats.objects.create(user=user, quit_date=validated_data['quit_date'], cigs_per_day=validated_data['cigs_per_day'],
                                      cost_per_pack=validated_data['cost_per_pack'], cigs_in_pack=validated_data['cigs_in_pack'])
        return user
