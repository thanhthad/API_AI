package com.example.restfulapi01.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users") // Đổi tên bảng thành "users" để tránh xung đột với từ khóa 'user' trong một số DB
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // Lưu ý: Trong ứng dụng thực tế, mật khẩu phải được mã hóa!

    @Column(unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<HistoryEmailCreated> historyEmails = new ArrayList<>();

    // Constructor bỏ qua id và historyEmails cho việc tạo mới
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}