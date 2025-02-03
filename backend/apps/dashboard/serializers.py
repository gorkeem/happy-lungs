from rest_framework import serializers
from .models import DashboardStats

class DashboardStatsSerializer(serializers.ModelSerializer):
    days_since_quit = serializers.SerializerMethodField()
    money_saved = serializers.SerializerMethodField()
    cigarettes_avoided = serializers.SerializerMethodField()
    current_co_level = serializers.SerializerMethodField()
    get_healing_milestones = serializers.SerializerMethodField()
    save = serializers.SerializerMethodField()
    
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
    

