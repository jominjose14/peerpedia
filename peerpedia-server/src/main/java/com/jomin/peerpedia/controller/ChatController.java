package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.bean.RequestLocal;
import com.jomin.peerpedia.data.entity.ChatMessage;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.ChatMessageRepository;
import com.jomin.peerpedia.data.repository.UserRepository;
import com.jomin.peerpedia.dto.ChatMessageRequest;
import com.jomin.peerpedia.dto.ChatMessageResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/chats")
@Validated
public class ChatController {

    private final RequestLocal requestLocal;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @GetMapping(value = "/history", params = {"start", "end", "user-id"})
    public ResponseEntity<Map<String,Object>> getHistory(@RequestParam("start") @NotNull @Min(1) @Max(1000000000) Long start, @RequestParam("end") @NotNull @Min(1) @Max(1000000000) Long end, @RequestParam("user-id") @NotNull @Min(1) @Max(1000000) Long userId) {
        User currentUser = requestLocal.getCurrentUser();
        List<ChatMessage> chatMessageRows = chatMessageRepository.findTop20ByIdBetweenAndFrom_IdAndTo_IdOrFrom_IdAndTo_IdOrderByIdAsc(start, end, currentUser.getId(), userId, userId, currentUser.getId());
        List<ChatMessageResponse> history = new ArrayList<>(chatMessageRows.size());
        for(var chatMessageRow : chatMessageRows) {
            history.add(new ChatMessageResponse(chatMessageRow));
        }

        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched logged in user");
        responseBody.put("payload", history);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @PostMapping(value = "/message")
    public ResponseEntity<Map<String,Object>> postChatMessage(@RequestBody ChatMessageRequest requestBody) {
        Map<String,Object> responseBody = new LinkedHashMap<>();

        Optional<User> userOptional = userRepository.findById(requestBody.getRecipientId());
        if(userOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Chat message recipient user does not exist");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        User toUser = userOptional.get();
        User fromUser = requestLocal.getCurrentUser();
        ChatMessage row = new ChatMessage();
        row.setFrom(fromUser);
        row.setTo(toUser);
        row.setMessage(requestBody.getMessage());

        try {
            row = chatMessageRepository.save(row);
            responseBody.put("success", true);
            responseBody.put("message", "Chat message saved");
            responseBody.put("payload", new ChatMessageResponse(row));
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch(Exception ex) {
            log.error("Failed to persist chat message", ex);
            responseBody.put("success", false);
            responseBody.put("message", "Something went wrong");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
