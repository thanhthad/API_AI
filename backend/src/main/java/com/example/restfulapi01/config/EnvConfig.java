package com.example.restfulapi01.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class EnvConfig {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure()
                .filename(".env")
                .load();

        // Set vào System property cho Spring Boot đọc được
        System.setProperty("huggingface.api.token", dotenv.get("huggingface.token"));
    }
}
