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
public class PopulateRequest {
    @NotBlank
    @Size(min = 4, max = 16, message = "Password must be between 4 and 16 characters long")
    private String password;
}
