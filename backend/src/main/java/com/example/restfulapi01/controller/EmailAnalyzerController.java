package com.example.restfulapi01.controller;

import com.example.restfulapi01.payload.EmailAnalyzeRequest;
import com.example.restfulapi01.payload.EmailAnalyzeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analyze")
@CrossOrigin(origins = "http://localhost:5173/") // Cho phép tất cả các nguồn gốc
public class EmailAnalyzerController {

    @Value("${huggingface.api.url}")
    private String huggingFaceApiBaseUrl;

    @Value("${huggingface.api.token}")
    private String huggingFaceApiToken;

    @Value("${huggingface.model.id.multilabel}")
    private String multiLabelModelId; // facebook/bart-large-mnli

    private final WebClient webClient;

    // Constructor để inject WebClient
    public EmailAnalyzerController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostMapping
    public ResponseEntity<EmailAnalyzeResponse> analyzeEmail(@RequestBody EmailAnalyzeRequest request) {
        String textToAnalyze = request.getSubject() + " " + request.getBody();

        // Định nghĩa các nhãn bạn muốn phân loại
        List<String> candidateLabels = Arrays.asList(
                "spam email",               // Email rác
                "phishing attempt",         // Email lừa đảo
                "promotional offer",        // Email quảng cáo/tiếp thị
                "newsletter",               // Bản tin
                "transactional message",    // Thông báo giao dịch (đơn hàng, hóa đơn)
                "legitimate communication", // Giao tiếp hợp lệ, không phải spam/phishing
                "suspicious email",         // Email đáng ngờ (không rõ loại, cần xem xét thêm)
                "social media notification" // Thông báo mạng xã hội
        );

        // Chuẩn bị body request cho Zero-shot Classification của BART
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", textToAnalyze);
        requestBody.put("parameters", Map.of("candidate_labels", candidateLabels, "multi_label", true));

        Map<String, Object> aiResponseRaw = null;
        try {
            aiResponseRaw = webClient.post()
                    .uri(huggingFaceApiBaseUrl + multiLabelModelId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + huggingFaceApiToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Error calling multi-label AI API: " + e.getMessage());
            return ResponseEntity.status(500).body(new EmailAnalyzeResponse(
                    request.getSender(), request.getSubject(), request.getBody(),
                    "API_ERROR", 0.0, null, "Failed to analyze email with AI: " + e.getMessage()
            ));
        }

        String primaryPredictionLabel = "UNKNOWN";
        Double primaryPredictionScore = 0.0;
        List<Map<String, Object>> detailedPredictions = new ArrayList<>();

        if (aiResponseRaw != null && aiResponseRaw.containsKey("labels") && aiResponseRaw.containsKey("scores")) {
            List<String> labels = (List<String>) aiResponseRaw.get("labels");
            List<Double> scores = (List<Double>) aiResponseRaw.get("scores");

            // Tạo danh sách các Map { "label": "...", "score": ... }
            List<Map<String, Object>> rawPredictions = new ArrayList<>();
            for (int i = 0; i < labels.size(); i++) {
                Map<String, Object> predictionMap = new HashMap<>();
                predictionMap.put("label", labels.get(i));
                predictionMap.put("score", scores.get(i));
                rawPredictions.add(predictionMap);
            }

            // Sắp xếp các dự đoán theo điểm số giảm dần
            // Sắp xếp các dự đoán theo điểm số giảm dần
            rawPredictions.sort(Comparator.comparingDouble(map -> (Double) ((Map<String, Object>) map).get("score")).reversed());

            // Lấy nhãn chính và các nhãn chi tiết trên ngưỡng
            if (!rawPredictions.isEmpty()) {
                // Nhãn chính là nhãn có điểm số cao nhất
                primaryPredictionLabel = mapZeroShotLabelToCustomLabel((String) rawPredictions.get(0).get("label"));
                primaryPredictionScore = (Double) rawPredictions.get(0).get("score");

                // Lọc các nhãn chi tiết trên ngưỡng và ánh xạ
                for (Map<String, Object> prediction : rawPredictions) {
                    String currentLabel = (String) prediction.get("label");
                    Double currentScore = (Double) prediction.get("score");

                    if (currentScore > 0.4) { // Ngưỡng có thể điều chỉnh để lọc bớt nhãn ít liên quan
                        Map<String, Object> mappedPrediction = new HashMap<>();
                        mappedPrediction.put("label", mapZeroShotLabelToCustomLabel(currentLabel));
                        mappedPrediction.put("score", currentScore);
                        detailedPredictions.add(mappedPrediction);
                    }
                }
            }

            // Nếu không có nhãn nào đạt ngưỡng, hoặc không có dự đoán nào
            if (detailedPredictions.isEmpty()) {
                primaryPredictionLabel = "UNCLEAR";
                primaryPredictionScore = 0.0;
                // Thêm một thông báo vào detailedPredictions nếu muốn
                Map<String, Object> noPredictionMap = new HashMap<>();
                noPredictionMap.put("label", "No clear prediction above threshold");
                noPredictionMap.put("score", 0.0);
                detailedPredictions.add(noPredictionMap);
            }
        } else {
            primaryPredictionLabel = "AI_PARSE_ERROR";
            primaryPredictionScore = 0.0;
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("label", "AI response structure invalid");
            errorMap.put("score", 0.0);
            detailedPredictions.add(errorMap);
        }

        return ResponseEntity.ok(new EmailAnalyzeResponse(
                request.getSender(),
                request.getSubject(),
                request.getBody(),
                primaryPredictionLabel,
                primaryPredictionScore,
                detailedPredictions,
                "Email analysis complete."
        ));
    }

    // Helper để ánh xạ nhãn từ Zero-shot sang nhãn tùy chỉnh của bạn
    private String mapZeroShotLabelToCustomLabel(String zeroShotLabel) {
        if ("phishing attempt".equalsIgnoreCase(zeroShotLabel)) {
            return "PHISHING";
        } else if ("spam email".equalsIgnoreCase(zeroShotLabel)) {
            return "SPAM";
        } else if ("promotional offer".equalsIgnoreCase(zeroShotLabel)) {
            return "PROMOTIONAL";
        } else if ("legitimate communication".equalsIgnoreCase(zeroShotLabel)) {
            return "HAM"; // hoặc "LEGITIMATE"
        } else if ("suspicious email".equalsIgnoreCase(zeroShotLabel)) {
            return "SUSPICIOUS";
        } else if ("newsletter".equalsIgnoreCase(zeroShotLabel)) {
            return "NEWSLETTER";
        } else if ("transactional message".equalsIgnoreCase(zeroShotLabel)) {
            return "TRANSACTIONAL";
        } else if ("social media notification".equalsIgnoreCase(zeroShotLabel)) {
            return "SOCIAL_MEDIA";
        }
        return "OTHER";
    }
}