package com.example.restfulapi01.controller;

import com.example.restfulapi01.payload.LoginRequest;
import com.example.restfulapi01.payload.LoginResponse;
import com.example.restfulapi01.payload.RegisterRequest;
import com.example.restfulapi01.payload.MessageResponse; // Import MessageResponse
import com.example.restfulapi01.payload.ForgotPasswordRequest; // <-- IMPORT MỚI: DTO cho quên mật khẩu
import com.example.restfulapi01.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Trong môi trường production, hãy thay thế "*" bằng URL chính xác của frontend của bạn (ví dụ: "http://localhost:3000")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@RequestBody RegisterRequest request) {
        if (userService.registerUser(request)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("User registered successfully!", true));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Username or email already exists.", false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {
        LoginResponse response = userService.loginUser(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // <-- ENDPOINT MỚI: Xử lý yêu cầu quên mật khẩu -->
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Kiểm tra xem email có được cung cấp hay không
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Email không được để trống.", false));
        }

        try {
            userService.processForgotPassword(request.getEmail());
            // Trả về thông báo chung để tránh rò rỉ thông tin về sự tồn tại của email
            return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và cả thư mục Spam/Junk.", true));
        } catch (RuntimeException e) {
            // Log lỗi chi tiết trên server nhưng trả về thông báo chung cho client
            System.err.println("Error processing forgot password request for email " + request.getEmail() + ": " + e.getMessage());
            // Trả về thông báo chung ngay cả khi có lỗi từ UserService (ví dụ: email không tồn tại)
            // Điều này là một thực hành bảo mật tốt để tránh lộ thông tin người dùng
            return ResponseEntity.status(HttpStatus.OK) // Vẫn trả về 200 OK để tránh bị khai thác
                    .body(new MessageResponse("Nếu email tồn tại, mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và cả thư mục Spam/Junk.", true));
        } catch (Exception e) {
            // Xử lý các lỗi khác không phải RuntimeException
            System.err.println("Unexpected error during forgot password for email " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.", false));
        }
    }
}