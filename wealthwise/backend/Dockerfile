# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Add a non-root user for security
RUN addgroup -S wealthwise && adduser -S wealthwise -G wealthwise

COPY --from=builder /app/target/*.jar app.jar

RUN chown wealthwise:wealthwise app.jar
USER wealthwise

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]