pipeline {
    agent any
    stages {
        stage ('api test') {
            steps{
                git branch: 'main', credentialsId: 'github_login', url: 'https://github.com/fdanilon/api-tests-jest'
                bat 'npm run test'
            }
        }
    }
}