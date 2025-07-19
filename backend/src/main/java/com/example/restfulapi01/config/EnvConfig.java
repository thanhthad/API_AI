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

        System.setProperty("huggingface.api.token", dotenv.get("HUGGINGFACE_API_TOKEN"));
        // Đặt tên property rõ ràng cho model kiểm tra domain
        System.setProperty("huggingface.model.id.domain-check", dotenv.get("HUGGINGFACE_MODEL_ID_DOMAIN_CHECK"));
        // Đặt tên property rõ ràng cho model đa nhãn
        System.setProperty("huggingface.model.id.multilabel", dotenv.get("HUGGINGFACE_MODEL_ID_MULTILABEL"));
    }
}