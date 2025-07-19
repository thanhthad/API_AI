package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HuggingFaceParameters {
    private List<String> labels; // Danh sách các loại thực thể muốn tìm
}
