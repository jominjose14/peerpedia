package com.jomin.peerpedia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignupRequest {
    @NotBlank
    @Size(min = 1, max = 32, message = "Username must be between 1 and 32 characters long")
    private String username;

    @NotBlank
    @Size(min = 4, max = 16, message = "Password must be between 4 and 16 characters long")
    private String password;
}
