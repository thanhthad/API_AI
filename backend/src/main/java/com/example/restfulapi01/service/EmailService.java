package com.example.restfulapi01.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ĐÂY LÀ ĐỊA CHỈ EMAIL CỦA BẠN (NGƯỜI QUẢN TRỊ WEBSITE) MÀ BẠN MUỐN NHẬN CÁC TIN NHẮN TỪ FORM LIÊN HỆ.
    // BẠN BẮT BUỘC PHẢI THAY THẾ DÒNG NÀY BẰNG MỘT ĐỊA CHỈ EMAIL CÓ THẬT CỦA BẠN!
    // VÍ DỤ: private final String ADMIN_EMAIL = "emailcuaban@gmail.com";
    private final String ADMIN_EMAIL = "tauhaitac2k5@gmail.com"; // <-- BẮT BUỘC PHẢI SỬA DÒNG NÀY!

    // ĐỊA CHỈ EMAIL MÀ ỨNG DỤNG CỦA BẠN SẼ DÙNG ĐỂ GỬI MAIL ĐI.
    // Dòng này phải KHỚP CHÍNH XÁC với 'spring.mail.username' trong file application.properties.
    // Hiện tại bạn đã cấu hình đúng là "tauhaitac3k@gmail.com".
    private final String SENDER_EMAIL = "tauhaitac3k@gmail.com";

    /**
     * Gửi email chứa thông tin từ form liên hệ đến địa chỉ ADMIN_EMAIL.
     *
     * @param senderName Tên của người gửi từ form liên hệ.
     * @param senderEmail Địa chỉ email của người gửi từ form liên hệ.
     * @param messageContent Nội dung tin nhắn của người gửi từ form liên hệ.
     */
    public void sendContactFormEmail(String senderName, String senderEmail, String messageContent) {
        SimpleMailMessage message = new SimpleMailMessage();

        // Đặt địa chỉ email mà ứng dụng dùng để gửi đi
        message.setFrom(SENDER_EMAIL);

        // Đặt địa chỉ email mà bạn (admin) muốn nhận tin nhắn
        message.setTo(ADMIN_EMAIL);

        // Đặt chủ đề của email, bao gồm tên người gửi để dễ nhận biết
        message.setSubject("New Contact Form Submission from " + senderName);

        // Tạo nội dung chi tiết của email, bao gồm tên, email và tin nhắn của người dùng
        String emailBody = "Name: " + senderName + "\n" +
                "Email: " + senderEmail + "\n\n" +
                "Message:\n" + messageContent;
        message.setText(emailBody);

        try {
            mailSender.send(message);
            System.out.println("Contact form email sent successfully from " + SENDER_EMAIL + " to " + ADMIN_EMAIL +
                    " (Original sender: " + senderEmail + ")"); // Log thêm thông tin người gửi gốc
        } catch (MailException e) {
            System.err.println("Error sending contact form email: " + e.getMessage());
            // Ném lại một RuntimeException để tầng gọi biết có lỗi và có thể xử lý
            throw new RuntimeException("Failed to send contact email: " + e.getMessage(), e);
        }
    }
    // --- PHƯƠNG THỨC MỚI CHO CHỨC NĂNG QUÊN MẬT KHẨU ---
    public void sendPasswordResetEmail(String userEmail, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(SENDER_EMAIL); // Gửi từ email ứng dụng của bạn
        message.setTo(userEmail);      // Gửi ĐẾN email của người dùng (người yêu cầu reset)
        message.setSubject("Yêu cầu lấy lại mật khẩu tài khoản của bạn tại YourApp"); // Thay "YourApp" bằng tên ứng dụng của bạn

        // Nội dung email gửi mật khẩu
        String emailBody = "Xin chào " + username + ",\n\n" +
                "Bạn đã yêu cầu lấy lại mật khẩu cho tài khoản của mình.\n" +
                "Mật khẩu của bạn là: " + password + "\n\n" + // <-- LƯU Ý: RẤT NGUY HIỂM!
                "Để bảo mật, chúng tôi khuyến nghị bạn nên đổi mật khẩu ngay sau khi đăng nhập.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ YourApp"; // Thay "YourApp" bằng tên ứng dụng của bạn

        message.setText(emailBody);

        try {
            mailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + userEmail);
        } catch (MailException e) {
            System.err.println("Error sending password reset email to " + userEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        }
    }
}