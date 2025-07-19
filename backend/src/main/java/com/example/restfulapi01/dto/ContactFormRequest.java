package com.example.restfulapi01.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// src/main/java/com/example/yourapp/dto/ContactFormRequest.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactFormRequest {
    private String name;
    private String email;
    private String message;

}