package com.jomin.peerpedia.dto;

import com.jomin.peerpedia.data.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Set<String> teachSkills;
    private Set<String> learnSkills;
    private String bio;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.teachSkills = user.getTeachSkills();
        this.learnSkills = user.getLearnSkills();
        this.bio = user.getBio();
    }
}
