package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.dto.ChatMessageRequest;
import com.jomin.peerpedia.dto.ChatMessageResponse;
import com.jomin.peerpedia.service.ChatMessageService;
import com.jomin.peerpedia.service.UserService;
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

    private final ChatMessageService chatMessageService;
    private final UserService userService;

    @GetMapping(value = "/history", params = {"start", "end", "user-id"})
    public ResponseEntity<Map<String,Object>> getHistory(@RequestParam("start") @NotNull @Min(1) @Max(1000000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000000) Long endId, @RequestParam("user-id") @NotNull @Min(1) @Max(1000000) Long userId) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<ChatMessageResponse>> history = chatMessageService.getHistory(startId, endId, userId);
        if(history.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch chat history");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched chat history");
        responseBody.put("payload", history.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @PostMapping(value = "/message")
    public ResponseEntity<Map<String,Object>> postChatMessage(@RequestBody ChatMessageRequest requestBody) {
        Map<String,Object> responseBody = new LinkedHashMap<>();

        Optional<User> toUserOptional = userService.getRow(requestBody.getRecipientId());
        if(toUserOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Chat message recipient user does not exist");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        Optional<User> fromUserOptional = userService.getCurrentUserRow();
        if(fromUserOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Chat message author user does not exist");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        ChatMessageResponse chatMessageResponse = chatMessageService.create(fromUserOptional.get(), toUserOptional.get(), requestBody.getMessage());
        responseBody.put("success", true);
        responseBody.put("message", "Chat message saved");
        responseBody.put("payload", chatMessageResponse);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
