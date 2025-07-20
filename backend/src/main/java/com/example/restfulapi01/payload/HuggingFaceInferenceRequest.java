package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HuggingFaceInferenceRequest {
    private String inputs;
    // Không cần trường 'parameters' cho model này nữa
}