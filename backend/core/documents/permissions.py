from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminUser(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsAdminOrTeamLead(BasePermission):
    def has_permission(self,request,view):
        return(
            request.user.is_authenticated and 
            request.user.role in ['admin','team_lead']
        )

class IsAdminOrTeamLeadOrReadOnly(BasePermission):
    def has_permission(self,request,view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS :
            return True
        return request.user.role in ['admin','team_lead']

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self,request,view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role == 'admin'

