FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY ./build/libs/*.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java","--add-opens","java.management/javax.management=ALL-UNNAMED","-jar","app.jar"]