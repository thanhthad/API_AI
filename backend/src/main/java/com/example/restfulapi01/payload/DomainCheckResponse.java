package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomainCheckResponse {
    private String domain;
    private String status; // Ví dụ: SAFE, MALICIOUS, INVALID_FORMAT, ERROR, UNKNOWN
    private String message;
    private double confidence; // Điểm tin cậy từ model AI
}