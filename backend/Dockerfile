FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy only backend folder contents
COPY backend/. .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]
