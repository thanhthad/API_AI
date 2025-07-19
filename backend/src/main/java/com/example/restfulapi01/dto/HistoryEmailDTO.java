package com.example.restfulapi01.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryEmailDTO {
    private Long id;
    private String sender;
    private String subject;
    private String body;
    private String primaryPredictionLabel;
    private Double primaryPredictionScore;
    private List<Map<String, Object>> detailedPredictions; // Đã parse từ JSON string
    private LocalDateTime analysisTime;
    private Long userId; // ID của người dùng sở hữu lịch sử này
}