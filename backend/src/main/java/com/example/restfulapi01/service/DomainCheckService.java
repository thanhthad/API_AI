package com.example.restfulapi01.service;
import com.example.restfulapi01.payload.DomainCheckResponse;
import com.example.restfulapi01.payload.HuggingFaceInferenceRequest;
import com.example.restfulapi01.payload.HuggingFaceParameters;
import com.example.restfulapi01.payload.EntityPrediction;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Arrays; // Import mới
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors; // Import mới

@Service
public class DomainCheckService {

    @Value("${huggingface.api.token}")
    private String huggingFaceApiToken;

    @Value("${huggingface.model.id.domain-check}")
    private String huggingFaceModelId;

    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;

    // Danh sách các loại thực thể PII bạn muốn model GLiNER nhận diện
    private static final List<String> PII_LABELS = Arrays.asList(
            "EMAIL_ADDRESS", "IP_ADDRESS", "URL", "PHONE_NUMBER",
            "CREDIT_CARD_NUMBER", "PERSON", "LOCATION", "ORGANIZATION",
            "DATE", "TIME"
    );

    public DomainCheckService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @PostConstruct
    public void init() {
        String baseUrl = "https://api-inference.huggingface.co/models/" + huggingFaceModelId;

        System.out.println("Hugging Face API URL: " + baseUrl);

        this.webClient = webClientBuilder.baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + huggingFaceApiToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public DomainCheckResponse checkDomainSafety(String domain) {
        String status;
        String message;
        double confidence = 0.0; // Với GLiNER, confidence có thể không trực tiếp là "an toàn/lừa đảo"

        if (!isValidDomain(domain)) {
            status = "INVALID_FORMAT";
            message = "The provided domain or URL format is invalid.";
            return new DomainCheckResponse(domain, status, message, confidence);
        }

        // Với GLiNER, bạn có thể gửi toàn bộ URL hoặc một đoạn văn bản
        // Thay vì "cleanDomain", có thể bạn muốn gửi toàn bộ URL hoặc một mô tả
        String textToAnalyze = domain; // Chúng ta sẽ gửi trực tiếp domain/URL để xem nó nhận diện gì

        // Tạo request với các nhãn PII muốn tìm
        HuggingFaceInferenceRequest request = new HuggingFaceInferenceRequest(
                textToAnalyze,
                new HuggingFaceParameters(PII_LABELS)
        );

        try {
            // GLiNER thường trả về List<EntityPrediction> trực tiếp, không phải List<List<...>>
            List<EntityPrediction> predictions = webClient.post()
                    .body(BodyInserters.fromValue(request))
                    .retrieve()
                    .onStatus(statusPredicate -> statusPredicate.is4xxClientError(), clientResponse -> {
                        System.err.println("Client Error Status: " + clientResponse.statusCode() + " Headers: " + clientResponse.headers().asHttpHeaders());
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(body -> {
                                    System.err.println("Client Error Body: " + body);
                                    return clientResponse.createException();
                                })
                                .flatMap(Mono::error);
                    })
                    .onStatus(statusPredicate -> statusPredicate.is5xxServerError(), serverResponse -> {
                        System.err.println("Server Error Status: " + serverResponse.statusCode() + " Headers: " + serverResponse.headers().asHttpHeaders());
                        return serverResponse.bodyToMono(String.class)
                                .flatMap(body -> {
                                    System.err.println("Server Error Body: " + body);
                                    return serverResponse.createException();
                                })
                                .flatMap(Mono::error);
                    })
                    // Thay đổi kiểu trả về thành List<EntityPrediction>
                    .bodyToMono(new ParameterizedTypeReference<List<EntityPrediction>>() {})
                    .block();

            if (predictions == null || predictions.isEmpty()) {
                status = "CLEAN";
                message = "No specific PII entities found in the domain/URL.";
                // Với GLiNER, không có khái niệm confidence trực tiếp cho "an toàn"
                // Bạn có thể đặt confidence cao nếu không tìm thấy gì.
                confidence = 1.0;
            } else {
                // Nếu có thực thể PII được tìm thấy, có thể coi là "có vấn đề" hoặc cần xem xét
                status = "PII_DETECTED";
                // Lấy danh sách các loại thực thể tìm thấy và các từ khóa
                String detectedEntities = predictions.stream()
                        .map(p -> p.getEntity_group() + ": '" + p.getWord() + "' (score: " + String.format("%.2f", p.getScore()) + ")")
                        .collect(Collectors.joining(", "));
                message = "Detected PII entities: " + detectedEntities;

                // Confidence ở đây có thể là confidence của thực thể có điểm cao nhất
                confidence = predictions.stream()
                        .mapToDouble(EntityPrediction::getScore)
                        .max()
                        .orElse(0.0);

                // Bạn có thể thêm logic để phân loại "MALICIOUS" nếu tìm thấy IP_ADDRESS, EMAIL_ADDRESS
                // hoặc các thực thể khác mà bạn cho là dấu hiệu của lừa đảo.
                // Ví dụ:
                boolean isPotentiallyMalicious = predictions.stream()
                        .anyMatch(p -> p.getEntity_group().equals("IP_ADDRESS") || p.getEntity_group().equals("EMAIL_ADDRESS"));
                if (isPotentiallyMalicious) {
                    status = "POTENTIALLY_MALICIOUS_PII";
                    message = "Detected potentially malicious PII (like IP/Email): " + detectedEntities;
                }
            }
            return new DomainCheckResponse(domain, status, message, confidence);

        } catch (WebClientResponseException e) {
            System.err.println("WebClientResponseException caught: " + e.getStatusCode() + " - " + e.getStatusText() + " - Body: " + e.getResponseBodyAsString());
            e.printStackTrace();

            status = "ERROR";
            message = "Error from AI service: " + e.getStatusCode() + " - " + e.getStatusText();

            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                message = "AI service authentication failed. Check your Hugging Face API token.";
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                message = "AI service rate limit exceeded. Please try again later.";
            } else if (e.getStatusCode().is4xxClientError()) {
                message = "Invalid request to AI service. Check input format or model compatibility. Details: " + e.getResponseBodyAsString();
            } else if (e.getStatusCode().is5xxServerError()) {
                message = "AI service internal error. Service might be temporarily unavailable. Details: " + e.getResponseBodyAsString();
            }
            return new DomainCheckResponse(domain, status, message, confidence);

        } catch (Exception e) {
            System.err.println("General Exception caught during domain analysis: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();

            status = "ERROR";
            message = "An unexpected error occurred during domain analysis. Please try again. Details: " + e.getClass().getSimpleName() + ": " + e.getMessage();
            confidence = 0.0;
            return new DomainCheckResponse(domain, status, message, confidence);
        }
    }

    private boolean isValidDomain(String domain) {
        String domainRegex = "^(http[s]?://)?(www\\.)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,63}(\\/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)?$";
        return Pattern.matches(domainRegex, domain);
    }
}