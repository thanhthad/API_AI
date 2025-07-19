package com.example.restfulapi01.repository;


import com.example.restfulapi01.model.HistoryEmailCreated;
import com.example.restfulapi01.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryEmailCreatedRepository extends JpaRepository<HistoryEmailCreated, Long> {
    List<HistoryEmailCreated> findByUser(User user);
    List<HistoryEmailCreated> findByUserId(Long userId); // Tìm lịch sử theo ID của người dùng
}