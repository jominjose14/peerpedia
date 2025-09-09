package com.jomin.peerpedia.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessageRequest {
    @NotNull
    @Min(1)
    @Max(1000000)
    private Long recipientId;

    @NotBlank
    @Size(min = 1, max = 1000, message = "Chat message must be between 1 and 1000 characters long")
    private String message;
}
