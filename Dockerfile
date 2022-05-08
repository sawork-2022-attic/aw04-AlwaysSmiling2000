FROM openjdk:11-jre-slim

COPY target/*.jar /target/

CMD java -jar /target/*.jar
