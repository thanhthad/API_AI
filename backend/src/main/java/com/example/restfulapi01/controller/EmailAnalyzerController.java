package com.example.restfulapi01.controller; // Đảm bảo package này khớp với dự án của bạn

import com.example.restfulapi01.payload.EmailAnalyzeRequest;
import com.example.restfulapi01.payload.EmailAnalyzeResponse;
import com.example.restfulapi01.dto.HistoryEmailDTO; // Import HistoryEmailDTO
import com.example.restfulapi01.service.HistoryEmailService; // Import HistoryEmailService
import com.example.restfulapi01.service.UserService; // Import UserService
import com.example.restfulapi01.model.User; // Import User model
import com.fasterxml.jackson.databind.ObjectMapper; // Import ObjectMapper

import org.springframework.beans.factory.annotation.Autowired; // Import Autowired
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analyze")
@CrossOrigin(origins = "*") // Bỏ dấu '/' cuối cùng để khớp tốt hơn
public class EmailAnalyzerController {

    @Value("${huggingface.api.url}")
    private String huggingFaceApiBaseUrl;

    @Value("${huggingface.api.token}")
    private String huggingFaceApiToken;

    @Value("${huggingface.model.id.multilabel}")
    private String multiLabelModelId; // facebook/bart-large-mnli

    private final WebClient webClient;

    @Autowired // Inject UserService để tìm người dùng
    private UserService userService;

    @Autowired // Inject HistoryEmailService để lưu lịch sử
    private HistoryEmailService historyEmailService;

    @Autowired // Inject ObjectMapper để xử lý JSON (cho detailedPredictions)
    private ObjectMapper objectMapper;


    // Constructor để inject WebClient.
    // Các @Value và @Autowired sẽ được Spring tự động inject sau khi constructor chạy.
    public EmailAnalyzerController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostMapping("/{userId}") // Endpoint POST mới: bao gồm userId trong URL
    public ResponseEntity<EmailAnalyzeResponse> analyzeEmail(
            @PathVariable Long userId, // Lấy userId từ URL path
            @RequestBody EmailAnalyzeRequest request) {

        // 1. Tìm người dùng theo userId
        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            // Trả về lỗi nếu không tìm thấy người dùng
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new EmailAnalyzeResponse(
                    request.getSender(), request.getSubject(), request.getBody(),
                    "USER_NOT_FOUND", 0.0, null, "User with ID " + userId + " not found."
            ));
        }
        User user = userOptional.get(); // Lấy đối tượng User

        String textToAnalyze = request.getSubject() + " " + request.getBody();

        List<String> candidateLabels = Arrays.asList(
                "spam email",
                "phishing attempt",
                "promotional offer",
                "newsletter",
                "transactional message",
                "legitimate communication",
                "suspicious email",
                "social media notification"
        );

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new EmailAnalyzeResponse( // Dùng HttpStatus.INTERNAL_SERVER_ERROR
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

            List<Map<String, Object>> rawPredictions = new ArrayList<>();
            for (int i = 0; i < labels.size(); i++) {
                Map<String, Object> predictionMap = new HashMap<>();
                predictionMap.put("label", labels.get(i));
                predictionMap.put("score", scores.get(i));
                rawPredictions.add(predictionMap);
            }

            rawPredictions.sort(Comparator.comparingDouble(map -> (Double) ((Map<String, Object>) map).get("score")).reversed());

            if (!rawPredictions.isEmpty()) {
                primaryPredictionLabel = mapZeroShotLabelToCustomLabel((String) rawPredictions.get(0).get("label"));
                primaryPredictionScore = (Double) rawPredictions.get(0).get("score");

                for (Map<String, Object> prediction : rawPredictions) {
                    String currentLabel = (String) prediction.get("label");
                    Double currentScore = (Double) prediction.get("score");

                    if (currentScore > 0.4) {
                        Map<String, Object> mappedPrediction = new HashMap<>();
                        mappedPrediction.put("label", mapZeroShotLabelToCustomLabel(currentLabel));
                        mappedPrediction.put("score", currentScore);
                        detailedPredictions.add(mappedPrediction);
                    }
                }
            }

            if (detailedPredictions.isEmpty()) {
                primaryPredictionLabel = "UNCLEAR";
                primaryPredictionScore = 0.0;
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

        EmailAnalyzeResponse response = new EmailAnalyzeResponse(
                request.getSender(),
                request.getSubject(),
                request.getBody(),
                primaryPredictionLabel,
                primaryPredictionScore,
                detailedPredictions,
                "Email analysis complete."
        );

        // 2. LƯU LỊCH SỬ VÀO DATABASE
        historyEmailService.saveHistory(user, response); // Lưu ý: response ở đây là EmailAnalyzeResponse, không phải HistoryEmailDTO

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{userId}") // Endpoint GET để lấy lịch sử của người dùng
    public ResponseEntity<List<HistoryEmailDTO>> getUserHistory(@PathVariable Long userId) {
        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<HistoryEmailDTO> history = historyEmailService.getHistoryForUser(userId);
        return ResponseEntity.ok(history);
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
            return "HAM";
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