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
                    withSonarQubeEnv('sonarqube') {
                        script {
                            def scannerHome = tool name: 'sonarqubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'

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

                                echo "🔍 Running SonarQube analysis (Backend)..."
                                export PATH=\$PATH:${scannerHome}/bin
                                sonar-scanner \\
                                  -Dsonar.projectKey=q-generator-be \\
                                  -Dsonar.sources=src/main/java \\
                                  -Dsonar.projectBaseDir=. \\
                                  -Dsonar.java.binaries=build/classes/java/main \\
                                  -Dsonar.exclusions=**/test/**
                            """
                        }
                    }
                }
            }
        }

        stage('Build & Analyze AI') {
            steps {
                echo "🧠 Running SonarQube analysis for AI..."

                dir('ai') {
                    withSonarQubeEnv('sonarqube') {
                        script {
                            def scannerHome = tool name: 'sonarqubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'

                            sh """#!/bin/bash
                                echo "🔍 Running SonarQube analysis (AI)..."
                                export PATH=\$PATH:${scannerHome}/bin
                                sonar-scanner \\
                                  -Dsonar.projectKey=q-generator-ai \\
                                  -Dsonar.sources=. \\
                                  -Dsonar.language=py \\
                                  -Dsonar.exclusions=**/__pycache__/**,**/tests/**
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