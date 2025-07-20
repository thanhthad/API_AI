package com.example.restfulapi01.controller;

import com.example.restfulapi01.payload.DomainCheckRequest;
import com.example.restfulapi01.payload.DomainCheckResponse;
import com.example.restfulapi01.service.DomainCheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domain")
@CrossOrigin(origins = "*") // Cho phép ReactJS frontend của bạn truy cập
public class DomainCheckController {

    private final DomainCheckService domainCheckService;

    public DomainCheckController(DomainCheckService domainCheckService) {
        this.domainCheckService = domainCheckService;
    }

    @PostMapping("/check")
    public ResponseEntity<DomainCheckResponse> checkDomain(@RequestBody DomainCheckRequest request) {
        // Gọi service để kiểm tra domain/text
        DomainCheckResponse response = domainCheckService.checkDomainSafety(request.getDomain());
        return ResponseEntity.ok(response);
    }
}