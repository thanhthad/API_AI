package com.example.restfulapi01.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "history_email_created")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryEmailCreated {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    private String primaryPredictionLabel;
    private Double primaryPredictionScore;

    @Column(columnDefinition = "TEXT")
    private String detailedPredictionsJson; // Lưu dưới dạng JSON string để đơn giản

    @Column(nullable = false)
    private LocalDateTime analysisTime;

    // Constructor cho việc tạo mới từ kết quả phân tích
    public HistoryEmailCreated(User user, String sender, String subject, String body,
                               String primaryPredictionLabel, Double primaryPredictionScore,
                               String detailedPredictionsJson) {
        this.user = user;
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.primaryPredictionLabel = primaryPredictionLabel;
        this.primaryPredictionScore = primaryPredictionScore;
        this.detailedPredictionsJson = detailedPredictionsJson;
        this.analysisTime = LocalDateTime.now(); // Tự động set thời gian hiện tại
    }
}