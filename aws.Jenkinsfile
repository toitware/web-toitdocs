pipeline {
    agent {
      kubernetes {
        defaultContainer 'webtoitdocs'
        yamlFile 'Jenkins.pod.yaml'
      }
    }

    environment {
        BUILD_VERSION = sh(returnStdout: true, script: 'gitversion').trim()
        GITHUB_TOKEN = credentials('leon-github-npm')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage("install") {
            steps {
                sh 'npm config set //npm.pkg.github.com/:_authToken=$GITHUB_TOKEN'
                sh "yarn install"
            }
        }

        stage("lint") {
            steps {
                sh "yarn lint"
            }
        }

        stage("cypress") {
            steps {
                sh "yarn cypress:jenkins"
            }
            post {
                always {
                    junit "test-results.xml"
                }
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
                    sh "FILEEXT=tar.gz toitarchive ${BUILD_VERSION}.tar.gz toit-web toitdocs.toit.io ${BUILD_VERSION}"
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
