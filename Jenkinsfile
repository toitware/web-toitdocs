pipeline {

    agent {
        docker {
            image 'gcr.io/infrastructure-220307/jenkins-console-toolchain:20210203152910'
            label 'docker'
            args '-v /home/jenkins/agent:/home/jenkins/.cache/ -u jenkins'
            reuseNode true
        }
    }

    options {
      timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        BUILD_VERSION = sh(returnStdout: true, script: 'gitversion').trim()
    }

    stages {
        stage("install") {
            steps {
                sh "yarn install"
            }
        }

        stage("lint") {
            steps {
                sh "yarn lint"
            }
        }

        stage("build") {
            steps {
                sh "yarn run build"
            }
        }

        stage("upload") {
            when {
                anyOf {
                    branch 'master'
                    branch pattern: "release-v\\d+.\\d+", comparator: "REGEXP"
                    tag "v*"
                }
            }
            steps {
                sh "tar -zcf ${BUILD_VERSION}.tar.gz -C build ."
                withCredentials([[$class: 'FileBinding', credentialsId: 'gcloud-service-auth', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
                    sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
                    sh "gcloud config set project infrastructure-220307"
                    sh "toitarchive ${BUILD_VERSION}.tar.gz toit-web toitdocs.toit.io ${BUILD_VERSION}"
                }
            }

            post {
                always {
                    sh "rm -rf ./build/"
                }
            }
        }
    }
}
