package com.example.restfulapi01.service;

import com.example.restfulapi01.model.User;
import com.example.restfulapi01.payload.LoginRequest;
import com.example.restfulapi01.payload.LoginResponse;
import com.example.restfulapi01.payload.RegisterRequest;
import com.example.restfulapi01.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService; // Inject EmailService để gửi email

    public boolean registerUser(RegisterRequest request) {
        // Cần đảm bảo UserRepository có các phương thức này
        if (userRepository.existsByUsername(request.getUsername())) {
            return false; // Username đã tồn tại
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return false; // Email đã tồn tại
        }

        // LƯU Ý: TRONG ỨNG DỤNG THỰC TẾ, MẬT KHẨU PHẢI ĐƯỢC MÃ HÓA (ví dụ: dùng BCryptPasswordEncoder.encode())
        User newUser = new User(request.getUsername(), request.getPassword(), request.getEmail());
        userRepository.save(newUser);
        return true;
    }

    public LoginResponse loginUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // LƯU Ý: TRONG ỨNG DỤNG THỰC TẾ, HÃY SO SÁNH MẬT KHẨU ĐÃ MÃ HÓA (ví dụ: bcryptPasswordEncoder.matches())
            if (user.getPassword().equals(request.getPassword())) {
                return new LoginResponse(user.getId(), user.getUsername(), "Đăng nhập thành công!", true);
            }
        }
        return new LoginResponse(null, null, "Tên người dùng hoặc mật khẩu không hợp lệ.", false);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    /**
     * Xử lý yêu cầu quên mật khẩu: tìm người dùng và gửi mật khẩu của họ qua email.
     * Cảnh báo: Việc gửi mật khẩu plaintext qua email là KHÔNG AN TOÀN.
     *
     * @param email Địa chỉ email của người dùng yêu cầu lấy lại mật khẩu.
     * @throws RuntimeException nếu không tìm thấy người dùng hoặc có lỗi khi gửi email.
     */
    public void processForgotPassword(String email) {
        // 1. Tìm người dùng theo email.
        // Cần đảm bảo UserRepository có phương thức findByEmail(String email)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        // 2. Lấy mật khẩu của người dùng.
        // LƯU Ý BẢO MẬT: Đây là điểm yếu nếu mật khẩu không được mã hóa.
        String password = user.getPassword();

        // 3. Gửi email chứa mật khẩu về cho người dùng.
        // EmailService sẽ thực hiện việc gửi.
        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), password);
    }
}