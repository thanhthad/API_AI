package com.example.restfulapi01.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Tự động tạo getters, setters, toString, equals, hashCode (Lombok)
@NoArgsConstructor // Tự động tạo constructor không đối số (Lombok)
@AllArgsConstructor // Tự động tạo constructor có tất cả đối số (Lombok)
public class DomainCheckRequest {
    private String domain;
    // Chúng ta sẽ bỏ userId ở đây vì project này không có user/database
    // private Long userId;
}
