pipeline {
    agent any

    parameters {
        string(name: 'DEPLOY_COLOR', defaultValue: 'blue', description: '배포 색상')
    }

    environment {
        TZ = 'Asia/Seoul'
    }

    stages {
        stage('Inject Secrets') {
            steps {
                echo "🔐 Injecting environment files and application config..."

                withCredentials([
                    file(credentialsId: 'env-file', variable: 'ENV_FILE'),
                    file(credentialsId: 'app-yml', variable: 'APP_YML')
                ]) {
                    sh """
                        mkdir -p backend/src/main/resources
                        cp \$APP_YML backend/src/main/resources/application.yml
                    """
                }
            }
        }

        stage('Build & Analyze Backend') {
            steps {
                echo "🛠️ Running Gradle build and SonarQube analysis..."

                dir('backend') {
                    withCredentials([
                        file(credentialsId: 'env-file', variable: 'ENV_FILE'),
                        string(credentialsId: 'sonar', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''#!/bin/bash
                            echo "📄 Copying .env file..."
                            cp "$ENV_FILE" .env
                            ls -al .env || { echo "❌ .env not found"; exit 1; }

                            echo "🌿 Loading environment variables..."
                            set -o allexport
                            source .env
                            set +o allexport

                            echo "🔨 Building with Gradle..."
                            chmod +x gradlew
                            ./gradlew build

                            echo "🔍 Running SonarQube analysis..."
                            sonar-scanner \
                              -Dsonar.projectKey=q-generator-be \
                              -Dsonar.sources=src/main/java \
                              -Dsonar.projectBaseDir=. \
                              -Dsonar.exclusions=**/test/** \
                              -Dsonar.host.url=https://sonar.q-generator.com \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo "🐳 Building Backend Docker Image..."
                sh "docker build -t backend:${params.DEPLOY_COLOR} ./backend"
            }
        }

        stage('Build AI Docker Image') {
            steps {
                echo "🤖 Building AI Docker Image..."
                sh "docker build -t ai:${params.DEPLOY_COLOR} ./ai"
            }
        }
    }
}