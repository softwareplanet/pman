from django.urls import path
from . import views

urlpatterns = [
    path('me', views.ListMe.as_view()),
    path('search', views.ListSearch.as_view()),
    path('employee', views.ListEmployees.as_view()),
    path('employee/<int:model_id>', views.ListEmployee.as_view()),
    path('employee/<int:model_id>/candidate_presentation', views.ListDocCandidatePresentation.as_view()),
    path('project', views.ListProjects.as_view()),
    path('project/extended', views.ListProjectsExtended.as_view()),
    path('files_group', views.ListFilesGroups.as_view()),
    path('project/<int:model_id>', views.ListProject.as_view()),
    path('project/<int:model_id>/files', views.ListProjectFiles.as_view()),
    path('file/<int:model_id>', views.ListProjectFile.as_view()),
    path('skill', views.ListSkills.as_view()),
    path('skill/<int:model_id>', views.ListSkill.as_view()),
    path('school', views.ListSchools.as_view()),
    path('school/<int:model_id>', views.ListSchool.as_view()),
    path('employee/<int:employee_id>/project', views.ListEmployeeProjects.as_view()),
    path('employee/<int:employee_id>/project/<int:model_id>', views.ListEmployeeProject.as_view()),
    path('employee/<int:employee_id>/skill', views.ListEmployeeSkills.as_view()),
    path('employee/<int:employee_id>/skill/<int:model_id>', views.ListEmployeeSkill.as_view()),
    path('employee/<int:employee_id>/school', views.ListEmployeeSchools.as_view()),
    path('employee/<int:employee_id>/school/<int:model_id>', views.ListEmployeeSchool.as_view()),
    path('employee/<int:model_id>/files', views.ListEmployeeFiles.as_view()),
    path('employee/file/<int:model_id>', views.ListEmployeeFile.as_view()),
]
