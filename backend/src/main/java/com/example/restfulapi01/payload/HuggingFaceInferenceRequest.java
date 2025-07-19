package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HuggingFaceInferenceRequest {
    private String inputs;
    private HuggingFaceParameters parameters; // Thêm trường này
}