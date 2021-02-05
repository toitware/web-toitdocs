pipeline {
    agent {
      kubernetes {
      yaml """
kind: Pod
metadata:
  name: agent
spec:
  containers:
  - name: webtoitdocs
    image: 465068080952.dkr.ecr.eu-west-1.amazonaws.com/jenkins-console-toolchain:20210204155459
    command:
    - cat
    tty: true
"""
      }
    }

    options {
      timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage("install") {
            steps {
                container("webtoitdocs"){
                    sh "yarn install"
                }
            }
        }

        stage("lint") {
            steps {
                container("webtoitdocs"){
                    sh "yarn lint"
                }
            }
        }

        stage("build") {
            steps {
                container("webtoitdocs"){
                    sh "yarn run build"
                }
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
                container("webtoitdocs"){
                    script {
                        BUILD_VERSION = sh(returnStdout: true, script: 'gitversion').trim()
                    }
                    sh "tar -zcf ${BUILD_VERSION}.tar.gz -C build ."
                    withCredentials([[$class: 'FileBinding', credentialsId: 'gcloud-service-auth', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
                        sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
                        sh "gcloud config set project infrastructure-220307"
                        sh "FILEEXT=tar.gz toitarchive ${BUILD_VERSION}.tar.gz toit-web toitdocs.toit.io ${BUILD_VERSION}"
                    }
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
