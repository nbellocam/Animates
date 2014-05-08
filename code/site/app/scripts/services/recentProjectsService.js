'use strict';

angular.module('animatesApp')
  .factory('recentProjectsService', function (localStorageService, localStorageConstants) {
    var indexOfProject = function(recentProjects, projectId){
      var project;

      for (var i = recentProjects.length - 1; i >= 0; i--) {
        project = JSON.parse(recentProjects[i]);

        if (project.id === projectId){
          return i;
        }
      }

      return -1;
    };

    var createProjectObject = function(projectTitle, projectId){
      return {
        title : projectTitle,
        id: projectId
      };
    };

    // Public API here
    return {
      updateRecentProjectList : function (projectTitle, projectId){
        var recentProjects = localStorageService.get(localStorageConstants.recentProjects);

        if(recentProjects){
          var index = indexOfProject(recentProjects, projectId);

          if (index !== 0){
            if (index !== -1){
              recentProjects.splice(1, index);
            }
          }
        } else {
          recentProjects = [];
        }

        var project = createProjectObject(projectTitle, projectId);

        recentProjects.unshift(JSON.stringify(project));

        if (recentProjects.length > localStorageConstants.maxRecentProjects){
          recentProjects.pop();
        }

        localStorageService.set(localStorageConstants.recentProjects, recentProjects);
      },
      removeFromRecentProjectList : function (projectId){
        var recentProjects = localStorageService.get(localStorageConstants.recentProjects);
        if(recentProjects){
          var index = indexOfProject(recentProjects, projectId);

          if (index !== -1){
            recentProjects.slice(1, index);
            localStorageService.set(localStorageConstants.recentProjects, recentProjects);
          }
        }
      },
      retrieveAll : function (){
        var recentProjects = localStorageService.get(localStorageConstants.recentProjects);
        var allProjects = [];

        if (recentProjects){
          for (var i = recentProjects.length - 1; i >= 0; i--) {
            allProjects.push(JSON.parse(recentProjects[i]));
          }
        }

        return allProjects;
      }
    };
  });
