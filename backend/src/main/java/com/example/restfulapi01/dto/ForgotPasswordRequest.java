// src/main/java/com/example/restfulapi01/payload/ForgotPasswordRequest.java
package com.example.restfulapi01.payload;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    private String email;
}