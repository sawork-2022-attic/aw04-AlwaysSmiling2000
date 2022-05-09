FROM openjdk:11-jre-slim

COPY target/webpos-0.0.1-SNAPSHOT.jar /target/

CMD java -jar /target/webpos-0.0.1-SNAPSHOT.jar
