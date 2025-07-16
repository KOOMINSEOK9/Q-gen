# 빌드 스테이지
FROM gradle:8.12.1-jdk17 AS build

WORKDIR /home/gradle/src

COPY --chown=gradle:gradle . .

RUN gradle build -x test --no-daemon --refresh-dependencies

# 실행 스테이지
FROM openjdk:17-jdk

WORKDIR /app

# 빌드 스테이지에서 생성된 app.jar 파일을 명확하게 복사
COPY --from=build /home/gradle/src/build/libs/app.jar ./app.jar

EXPOSE 8080

ENV JAVA_OPTS="\
    --add-opens=java.base/sun.nio.ch=ALL-UNNAMED \
    --add-opens=java.base/java.lang=ALL-UNNAMED \
    --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \
    --add-opens=java.base/java.io=ALL-UNNAMED \
    --add-opens=java.base/java.nio=ALL-UNNAMED \
    --add-opens=java.base/java.util=ALL-UNNAMED \
    --add-opens=java.base/java.util.concurrent=ALL-UNNAMED \
    --add-opens=java.base/java.net=ALL-UNNAMED \
    --add-opens=java.base/jdk.internal.misc=ALL-UNNAMED \
    -Djava.security.egd=file:/dev/./urandom"

CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]