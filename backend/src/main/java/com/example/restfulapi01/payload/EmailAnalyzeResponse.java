package com.example.restfulapi01.payload;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailAnalyzeResponse {
    private String sender;
    private String subject;
    private String body;
    private String primaryPredictionLabel; // Nhãn chính (tóm tắt)
    private Double primaryPredictionScore; // Điểm của nhãn chính
    private List<Map<String, Object>> detailedPredictions; // Danh sách chi tiết các nhãn và điểm số
    private String message; // Thông báo trạng thái
}