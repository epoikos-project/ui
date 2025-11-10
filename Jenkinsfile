@Library("teckdigital") _
def appName = "epoikos-ui"
def localBranchToGitopsValuesPath = [
    'main': 'apps/epoikos/ui.values.yaml',
]

pipeline {
   agent {
    kubernetes {
        inheritFrom "kaniko-template"
    }
  }
    
    stages {
        stage('Build and Tag Image') {
            steps {
                container('kaniko') {
                    script {
                        buildDockerImage(buildArgs: ['NEXT_PUBLIC_API_URL=https://epoikos.h4hn.de/api', 'NEXT_PUBLIC_WS_URL=wss://epoikos.h4hn.de/ws'])
                    }
                }
            }
        }

        stage('Update GitOps') {
            when {
                expression {
                    return localBranchToGitopsValuesPath.containsKey(getLocalBranchName())
                }
            }
            steps {
                script {
                    def valuesPath = localBranchToGitopsValuesPath[getLocalBranchName()]

                    updateGitops(appName: appName, valuesPath: valuesPath, gitOpsRepo: "https://github.com/ItsZiroy/gitops", credentialsId: "h4hn-service-user" , gitUserEmail: "github-bot@h4hn.de")
                }
            }
        }
    }
}