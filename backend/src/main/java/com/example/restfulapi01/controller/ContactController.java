// src/main/java/com/example/yourapp/controller/ContactController.java
package com.example.restfulapi01.controller;

import com.example.restfulapi01.dto.ContactFormRequest;
import com.example.restfulapi01.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
// Cho phép các request từ front-end React
@CrossOrigin(origins = "*") // Thay thế bằng URL của ứng dụng React của bạn
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendContactMessage(@RequestBody ContactFormRequest request) {
        // ... (kiểm tra rỗng) ...

        try {
            // Dòng này ĐÃ NHẬN email của người dùng từ frontend
            emailService.sendContactFormEmail(request.getName(), request.getEmail(), request.getMessage());
            return new ResponseEntity<>("Message sent successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Failed to send message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}