# Stage 1: Build
FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY . . 
# Hoặc COPY pom.xml . và COPY src src để tận dụng cache tốt hơn

# Build ứng dụng, bỏ qua test
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim 
WORKDIR /app

# Sửa dòng này để sao chép file JAR
# Sử dụng *.jar để khớp với bất kỳ file JAR nào trong target/
COPY --from=build /app/target/*.jar /app/app.jar 

# Expose cổng 8080 cho bên ngoài truy cập
EXPOSE 8080

# Lệnh chạy ứng dụng Spring Boot (chạy JAR)
ENTRYPOINT ["java", "-jar", "app.jar"] 
