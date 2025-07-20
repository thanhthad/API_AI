package com.example.restfulapi01.service;

import com.example.restfulapi01.payload.DomainCheckResponse;
import com.example.restfulapi01.payload.HuggingFaceInferenceRequest;
import com.example.restfulapi01.payload.LabelScore; // Đảm bảo import đúng
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

import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class DomainCheckService {

    @Value("${huggingface.api.token}")
    private String huggingFaceApiToken;

    @Value("${huggingface.model.id.domain-check}")
    private String huggingFaceModelId;

    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;

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

    public DomainCheckResponse checkDomainSafety(String inputString) {
        String status;
        String message;
        double confidence = 0.0;

        // Quan trọng: Model này được thiết kế để phân loại URL/Domain.
        // Cần đảm bảo input là định dạng URL/Domain hợp lệ.
        if (!isValidUrlOrDomain(inputString)) {
            status = "INVALID_FORMAT";
            message = "The provided input is not a valid URL or domain format for this model. Please provide a full URL (e.g., https://example.com) or a domain (e.g., example.com).";
            return new DomainCheckResponse(inputString, status, message, confidence);
        }

        HuggingFaceInferenceRequest request = new HuggingFaceInferenceRequest(inputString);

        try {
            // Model 'pirocheto/phishing-url-detection' trả về List<List<LabelScore>>
            // với list con thường chỉ chứa 2 phần tử (safe/phishing)
            List<List<LabelScore>> responseList = webClient.post()
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
                    .bodyToMono(new ParameterizedTypeReference<List<List<LabelScore>>>() {})
                    .block();

            if (responseList == null || responseList.isEmpty() || responseList.get(0) == null || responseList.get(0).isEmpty()) {
                status = "UNKNOWN";
                message = "Could not get a valid prediction from the AI model (empty or invalid response structure).";
            } else {
                List<LabelScore> predictions = responseList.get(0);
                LabelScore highestScoreLabel = predictions.stream()
                        .max(Comparator.comparingDouble(LabelScore::getScore))
                        .orElse(null);

                if (highestScoreLabel == null) {
                    status = "UNKNOWN";
                    message = "No clear prediction from the AI model.";
                } else {
                    confidence = highestScoreLabel.getScore();
                    String label = highestScoreLabel.getLabel().toUpperCase();

                    // Model 'pirocheto/phishing-url-detection' thường trả về "SAFE" và "PHISHING"
                    if (label.contains("PHISHING")) {
                        status = "MALICIOUS";
                        message = "This URL/domain is classified as MALICIOUS/PHISHING by the AI model.";
                    } else if (label.contains("SAFE")) {
                        status = "SAFE";
                        message = "This URL/domain appears to be SAFE/BENIGN based on our analysis.";
                    } else {
                        status = "UNKNOWN";
                        message = "AI model returned an unrecognized or ambiguous label: " + highestScoreLabel.getLabel();
                    }
                }
            }
            return new DomainCheckResponse(inputString, status, message, confidence);

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
            return new DomainCheckResponse(inputString, status, message, confidence);

        } catch (Exception e) {
            System.err.println("General Exception caught during analysis: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();

            status = "ERROR";
            message = "An unexpected error occurred during analysis. Please try again. Details: " + e.getClass().getSimpleName() + ": " + e.getMessage();
            confidence = 0.0;
            return new DomainCheckResponse(inputString, status, message, confidence);
        }
    }

    // Hàm kiểm tra định dạng URL/Domain hợp lệ
    private boolean isValidUrlOrDomain(String input) {
        // Regex kiểm tra URL đầy đủ hoặc chỉ domain.
        // Đã được tinh chỉnh để bao quát tốt hơn các trường hợp URL/domain.
        // Hỗ trợ cả HTTP/HTTPS, www, subdomains, và các ký tự hợp lệ trong đường dẫn.
        String urlOrDomainRegex = "^(http[s]?://)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,63}([a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)?$";
        return Pattern.matches(urlOrDomainRegex, input);
    }
}