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
                VERSION = sh(returnStdout: true, script: './tools/version.sh').trim()
            }
            steps {
                withCredentials([[$class: 'FileBinding', credentialsId: 'gcloud-service-auth', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
                    sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
                    sh "gcloud config set project infrastructure-220307"
                    sh "tar -zcvf ${VERSION}.tar -C build ."
                    sh "gsutil cp ${VERSION}.tar gs://toit-web/toitdocs/web/build.tar.gz"
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
