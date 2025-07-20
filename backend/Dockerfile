# Stage 1: Build
FROM maven:3-openjdk-17 AS build
WORKDIR /app

# Copy toàn bộ mã nguồn vào image
COPY . .

# Build ứng dụng, bỏ qua test
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file .war đã build từ stage trước
COPY --from=build /app/target/query1-0.0.1-SNAPSHOT.war query1.war

# Expose cổng 8080 cho bên ngoài truy cập
EXPOSE 8080

# Lệnh chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "query1.war"]
