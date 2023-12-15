pipeline {
    agent any
    def dockerhub
    tools{
        jdk 'java11'
        nodejs 'node18'
    }
    stages {
        stage('Build') {
            steps {
                sh 'java -version'
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('Sonar') {
                        sh 'echo $sonar_scanner'
                        sh """
                        ${env.sonar_scanner} \\
                        -Dsonar.projectKey=totallyspies \\
                        -Dsonar.projectName=totallyspies \\
                        -Dsonar.projectVersion=1.0 \\
                        -Dsonar.sources=backend/src,frontend/src,lstmModel/src \\
                        -Dsonar.tests=backend/test,lstmModel/test \\
                        -Dsonar.inclusions=backend/test/**/*.test.js,backend/test/gtfs-real-time/**/*.test.js,backend/test/Util/**/*.test.js,backend/test/Database/**/*.test.js,
                        -Dsonar.sourceEncoding=UTF-8
                        """
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dockerhub = docker.build("siri0000/totallydockerhub")
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        dockerhub.push("${env.BUILD_NUMBER}")
                    }
                }
            }
        }
        stage('Trigger ManifestUpdate') {
            steps {
                echo 'Triggering ManifestUpdate'
                build job: 'ManifestUpdate', parameters: [
                    string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)
                ]
            }
        }
        stage('Builds to S3') {
            steps {
                script {
                        // Define the build directory outside any step
                                            def buildDir = "/var/lib/jenkins/jobs/'totally spies'/branches/${BRANCH_NAME}/builds/${BUILD_NUMBER}/"

                                            // Upload the build archive to S3 (customize bucket and file details)
                                            s3Upload(
                                                source: "${buildDir}/build_archive.zip",
                                                bucket: 'totally-bucket',
                                                key: "builds/${BRANCH_NAME}/${BUILD_NUMBER}/build_archive.zip",
                                                acl: 'private'
                                            )
                                            sh "rm ${WORKSPACE}/build_archive.zip"
                }
            }
        }

    }
    post {
        always {
            echo 'Prozess abgeschlossen.'
        }
    }
}
