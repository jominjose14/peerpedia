FROM eclipse-temurin:21-jdk-alpine AS builder
RUN apk add --no-cache curl unzip
WORKDIR /app
RUN curl -L https://services.gradle.org/distributions/gradle-8.14.3-bin.zip -o gradle.zip && \
    unzip gradle.zip && \
    mv gradle-8.14.3 /opt/gradle && \
    rm gradle.zip
ENV GRADLE_HOME=/opt/gradle
ENV PATH=$GRADLE_HOME/bin:$PATH
COPY gradle/ gradle/
COPY gradlew gradlew.bat ./
COPY build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon
COPY src/ src/
RUN ./gradlew clean bootJar --no-daemon --parallel \
    -Dorg.gradle.jvmargs="-Xmx1g -XX:+UseG1GC" \
    --build-cache

FROM eclipse-temurin:21-jre-alpine AS runtime
# Install dumb-init for proper signal handling and create non-root user
RUN apk add --no-cache dumb-init && \
    addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -s /bin/sh -D appuser
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
# Change ownership to non-root user
RUN chown -R appuser:appuser /app
# Switch to non-root user
USER appuser
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1
EXPOSE 8080
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:+UseStringDeduplication \
               -XX:+OptimizeStringConcat \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.jmx.enabled=false"
# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS --add-opens java.management/javax.management=ALL-UNNAMED -jar app.jar"]

# FROM eclipse-temurin:21-jre-alpine
# WORKDIR /app
# COPY ./build/libs/*.jar ./app.jar
# EXPOSE 8080
# ENTRYPOINT ["java","--add-opens","java.management/javax.management=ALL-UNNAMED","-jar","app.jar"]