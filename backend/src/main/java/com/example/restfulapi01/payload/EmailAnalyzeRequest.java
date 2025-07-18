package com.example.restfulapi01.payload;

import lombok.Data;

@Data
public class EmailAnalyzeRequest {
    private String sender;
    private String subject;
    private String body;
}