package com.example.restfulapi01.service;

import com.example.restfulapi01.model.HistoryEmailCreated;
import com.example.restfulapi01.model.User;
import com.example.restfulapi01.dto.HistoryEmailDTO;
import com.example.restfulapi01.payload.EmailAnalyzeResponse;
import com.example.restfulapi01.repository.HistoryEmailCreatedRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryEmailService {

    @Autowired
    private HistoryEmailCreatedRepository historyEmailCreatedRepository;

    @Autowired
    private ObjectMapper objectMapper; // Để xử lý JSON

    public HistoryEmailCreated saveHistory(User user, EmailAnalyzeResponse analysisResponse) {
        try {
            // Chuyển detailedPredictions List<Map<String, Object>> thành JSON string để lưu vào DB
            String detailedPredictionsJson = objectMapper.writeValueAsString(analysisResponse.getDetailedPredictions());

            HistoryEmailCreated history = new HistoryEmailCreated(
                    user,
                    analysisResponse.getSender(),
                    analysisResponse.getSubject(),
                    analysisResponse.getBody(),
                    analysisResponse.getPrimaryPredictionLabel(),
                    analysisResponse.getPrimaryPredictionScore(),
                    detailedPredictionsJson
            );
            return historyEmailCreatedRepository.save(history);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting detailed predictions to JSON: " + e.getMessage());
            // Có thể throw exception hoặc trả về null tùy thuộc vào logic xử lý lỗi mong muốn
            return null;
        }
    }

    public List<HistoryEmailDTO> getHistoryForUser(Long userId) {
        List<HistoryEmailCreated> historyEntities = historyEmailCreatedRepository.findByUserId(userId);
        return historyEntities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper method để chuyển đổi Entity sang DTO
    private HistoryEmailDTO convertToDto(HistoryEmailCreated entity) {
        List<java.util.Map<String, Object>> detailedPredictions = null;
        if (entity.getDetailedPredictionsJson() != null) {
            try {
                detailedPredictions = objectMapper.readValue(entity.getDetailedPredictionsJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, java.util.Map.class));
            } catch (JsonProcessingException e) {
                System.err.println("Error parsing detailed predictions JSON from DB: " + e.getMessage());
                // Set về null hoặc list rỗng nếu parsing lỗi
                detailedPredictions = List.of();
            }
        }

        return new HistoryEmailDTO(
                entity.getId(),
                entity.getSender(),
                entity.getSubject(),
                entity.getBody(),
                entity.getPrimaryPredictionLabel(),
                entity.getPrimaryPredictionScore(),
                detailedPredictions,
                entity.getAnalysisTime(),
                entity.getUser().getId()
        );
    }
}