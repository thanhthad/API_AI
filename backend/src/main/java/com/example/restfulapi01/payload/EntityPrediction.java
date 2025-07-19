package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityPrediction { // Đổi tên từ LabelScore
    private String entity_group; // Tên loại thực thể (ví dụ: "EMAIL", "IP_ADDRESS")
    private double score;
    private String word; // Đoạn văn bản được nhận diện là thực thể
    private int start;
    private int end;
}