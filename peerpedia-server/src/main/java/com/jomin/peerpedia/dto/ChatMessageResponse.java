package com.jomin.peerpedia.dto;

import com.jomin.peerpedia.data.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessageResponse {
    private Long id;
    private Long from;
    private Long to;
    private LocalDateTime createdAt;
    private String message;

    public ChatMessageResponse(ChatMessage chatMessage) {
        this.id = chatMessage.getId();
        this.from = chatMessage.getFrom().getId();
        this.to = chatMessage.getTo().getId();
        this.createdAt = chatMessage.getCreatedAt();
        this.message = chatMessage.getMessage();
    }
}
