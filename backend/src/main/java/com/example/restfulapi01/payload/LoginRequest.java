package com.example.restfulapi01.payload;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
