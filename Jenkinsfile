pipeline {
    agent any

    tools {
        // Jenkins에 등록한 SonarQube Scanner 툴 이름
        sonarQubeScanner 'sonarqubeScanner'
    }

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
                    sh '''
                        mkdir -p backend/src/main/resources
                        cp "$APP_YML" backend/src/main/resources/application.yml
                        cp "$ENV_FILE" backend/.env
                    '''
                }
            }
        }

        stage('Build & Analyze Backend') {
            steps {
                echo "🛠️ Running Gradle build and SonarQube analysis..."

                dir('backend') {
                    withCredentials([
                        string(credentialsId: 'sonar', variable: 'SONAR_AUTH_TOKEN')
                    ]) {
                        withSonarQubeEnv('sonarqube') {
                            def scannerHome = tool 'sonarqubeScanner'

                            sh """#!/bin/bash
                                echo "📄 Checking .env..."
                                ls -al .env || { echo '❌ .env not found'; exit 1; }

                                echo "🌿 Loading environment variables..."
                                set -o allexport
                                source .env
                                set +o allexport

                                echo "🔨 Running Gradle build..."
                                chmod +x gradlew
                                ./gradlew build

                                echo "🔍 Running SonarQube analysis..."
                                export PATH=\$PATH:${scannerHome}/bin
                                sonar-scanner \\
                                  -Dsonar.projectKey=q-generator-be \\
                                  -Dsonar.sources=src/main/java \\
                                  -Dsonar.projectBaseDir=. \\
                                  -Dsonar.exclusions=**/test/** \\
                                  -Dsonar.login=\$SONAR_AUTH_TOKEN
                            """
                        }
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