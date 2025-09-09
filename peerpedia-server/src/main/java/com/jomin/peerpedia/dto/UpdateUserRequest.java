package com.jomin.peerpedia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class UpdateUserRequest {
    @Size(min = 5, max = 70, message = "Email must be between 5 and 70 characters long")
    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 10, message = "Teach Skills must have less than 10 skills")
    private Set<String> teachSkills;

    @Size(max = 10, message = "Learn Skills must have less than 10 skills")
    private Set<String> learnSkills;

    @Size(max = 500, message = "Bio must be less than 500 characters long")
    private String bio;
}
