package com.jomin.peerpedia.service;

import com.jomin.peerpedia.bean.RequestLocal;
import com.jomin.peerpedia.data.entity.ChatMessage;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.ChatMessageRepository;
import com.jomin.peerpedia.dto.ChatMessageRequest;
import com.jomin.peerpedia.dto.ChatMessageResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final RequestLocal requestLocal;

    public ChatMessageResponse create(User fromUser, User toUser, String message) {
        ChatMessage row = new ChatMessage();
        row.setFrom(fromUser);
        row.setTo(toUser);
        row.setMessage(message);
        ChatMessage createdRow = chatMessageRepository.save(row);
        return new ChatMessageResponse(createdRow);
    }

    public Optional<List<ChatMessageResponse>> getHistory(Long startId, Long endId, Long userId) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User currentUser = currentUserOptional.get();
        List<ChatMessage> rows = chatMessageRepository.findTop20ByIdBetweenAndFrom_IdAndTo_IdOrFrom_IdAndTo_IdOrderByIdAsc(startId, endId, currentUser.getId(), userId, userId, currentUser.getId());
        List<ChatMessageResponse> history = new ArrayList<>(rows.size());
        for(var row : rows) {
            history.add(new ChatMessageResponse(row));
        }

        return Optional.of(history);
    }
}
