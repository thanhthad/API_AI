package com.example.restfulapi01.config; // Đảm bảo đúng package của bạn

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvConfig {

    @Value("${HUGGINGFACE_API_TOKEN}")
    private String huggingfaceApiToken;

    @Value("${HUGGINGFACE_MODEL_ID_DOMAIN_CHECK}")
    private String huggingfaceModelIdDomainCheck;

    @Value("${HUGGINGFACE_MODEL_ID_MULTILABEL}")
    private String huggingfaceModelIdMultilabel;

    // Các getter để truy cập các giá trị này từ các class khác (nếu cần)
    public String getHuggingfaceApiToken() {
        return huggingfaceApiToken;
    }

    public String getHuggingfaceModelIdDomainCheck() {
        return huggingfaceModelIdDomainCheck;
    }

    public String getHuggingfaceModelIdMultilabel() {
        return huggingfaceModelIdMultilabel;
    }
}