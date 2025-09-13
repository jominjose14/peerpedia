package com.jomin.peerpedia.data.repository;

import com.jomin.peerpedia.data.entity.ChatMessage;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop20ByIdBetweenAndFrom_IdAndTo_IdOrFrom_IdAndTo_IdOrderByIdAsc(Long startId, Long endId, Long fromId1, Long toId1, Long fromId2, Long toId2);
}
