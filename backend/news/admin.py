from django.contrib import admin
from .models import News, Category, UserProfile

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'is_published', 'created_at']
    list_filter = ['category', 'is_published', 'created_at']
    search_fields = ['title', 'content']
    list_editable = ['is_published']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'created_at']
    search_fields = ['user__username', 'user__email']