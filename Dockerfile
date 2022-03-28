FROM openjdk:11-jre-slim

COPY target/webpos-0.0.1-SNAPSHOT.jar /aw04/

CMD java -jar /aw04/webpos-0.0.1-SNAPSHOT.jar
