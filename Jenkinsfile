pipeline {

    agent {
        docker {
            image 'gcr.io/infrastructure-220307/jenkins-console-toolchain:20200102103553'
            label 'docker'
            args '-v /home/jenkins/agent:/home/jenkins/.cache/ -u jenkins'
            reuseNode true
        }
    }

    options {
      timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage("install") {
            steps {
                sh "npm install"
            }
        }

        // stage("test") {
        //     steps {
        //         sh "npm run test:jenkins"
        //     }
        //     post {
        //         always {
        //             junit "junit.xml"
        //         }
        //     }
        // }

        stage("build") {
            steps {
                sh "npm run build"
            }
        }

        stage("push") {
            when {
                anyOf {
                    branch 'master'
                    branch pattern: "release-v\\d+.\\d+", comparator: "REGEXP"
                }
            }
            environment {
                WEB_CONSOLE_VERSION = sh(returnStdout: true, script: './tools/version.sh').trim()
            }
            steps {
                sh 'DEBUG=true ./tools/version.sh'
                withCredentials([[$class: 'FileBinding', credentialsId: 'gcloud-service-auth', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
                    sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
                    sh "gcloud config set project infrastructure-220307"
                    sh "tar -cf ${WEB_CONSOLE_VERSION}.tar -C $CONSOLE_DIR build/"
                    sh "gsutil cp ${WEB_CONSOLE_VERSION}.tar gs://toit-web/toitdocs/web/build.tar.gz"
                }
            }

            post {
                always {
                    sh "make clean"
                }
            }
        }
    }
}
