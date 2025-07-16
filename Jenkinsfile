pipeline {
    agent any
    parameters {
        string(name: 'DEPLOY_COLOR', defaultValue: 'blue', description: '배포 색상')
    }
    environment {
        TZ = 'Asia/Seoul'
    }
    stages {
        stage('Build Backend') {
            steps {
                echo "🚀 Building Backend Docker Image"
                sh "docker build -t backend:${params.DEPLOY_COLOR} ./backend"
            }
        }
        stage('Build AI') {
            steps {
                echo "🚀 Building AI Docker Image"
                sh "docker build -t ai:${params.DEPLOY_COLOR} ./ai"
            }
        }
    }
}