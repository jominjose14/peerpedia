package com.jomin.peerpedia.bean;

import com.jomin.peerpedia.data.entity.User;
import jakarta.enterprise.context.RequestScoped;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@RequestScoped
@Getter @Setter
public class RequestLocal {
    private User currentUser;
}
