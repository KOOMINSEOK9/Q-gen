pipeline {
    agent any

    parameters {
        string(name: 'DEPLOY_COLOR', defaultValue: 'blue', description: '배포 색상')
    }

    environment {
        TZ = 'Asia/Seoul'
    }

    stages {
        stage('Build Frontend') {
            steps {
                echo "🎨 Building Frontend Docker Image..."
                sh "docker build -t frontend:${params.DEPLOY_COLOR} ./frontend"
            }
        }

        stage('Analyze Frontend with SonarQube') {
            steps {
                echo "🔍 Analyzing Frontend with SonarQube..."

                dir('frontend') {
                    withSonarQubeEnv('sonarqube') {
                        script {
                            def scannerHome = tool name: 'sonarqubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'

                            sh """#!/bin/bash
                                echo "🧪 Running SonarScanner for Frontend..."
                                export PATH=\$PATH:${scannerHome}/bin
                                sonar-scanner \\
                                  -Dsonar.projectKey=q-generator-fe \\
                                  -Dsonar.sources=. \\
                                  -Dsonar.projectBaseDir=. \\
                                  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.*,**/__tests__/** \\
                                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            """
                        }
                    }
                }
            }
        }
    }
}