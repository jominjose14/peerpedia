package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.dto.LoginRequest;
import com.jomin.peerpedia.dto.SignupRequest;
import com.jomin.peerpedia.dto.UserResponse;
import com.jomin.peerpedia.security.JwtProvider;
import com.jomin.peerpedia.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Validated
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserService userService;

    @GetMapping("/test")
    public Map<String,Object> getTest() {
        var responseBody = new LinkedHashMap<String,Object>();
        responseBody.put("success", true);
        responseBody.put("message", "Test successful");
        return responseBody;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Map<String,Object> resBody = new LinkedHashMap<>();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtProvider.generateToken(authentication);

            resBody.put("success", true);
            resBody.put("message", "Logged in successfully");
            resBody.put("token", token);
            return new ResponseEntity<>(resBody, HttpStatus.OK);
        } catch(BadCredentialsException ex) {
            resBody.put("success", false);
            resBody.put("message", "Username or password does not match");
            return new ResponseEntity<>(resBody, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String,Object>> registerUser(@RequestBody SignupRequest signupRequest) {
        if (userService.get(signupRequest.getUsername()).isPresent()) {
            Map<String,Object> resBody = new LinkedHashMap<>();
            resBody.put("success", false);
            resBody.put("message", "Username is already taken");
            return new ResponseEntity<>(resBody, HttpStatus.BAD_REQUEST);
        }

        Map<String,Object> resBody = new LinkedHashMap<>();
        Optional<UserResponse> userResponseOptional = userService.create(signupRequest);
        if(userResponseOptional.isEmpty()) {
            resBody.put("success", false);
            resBody.put("message", "Signup failed");
            return new ResponseEntity<>(resBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        resBody.put("success", true);
        resBody.put("message", "User registered successfully");
        resBody.put("payload", userResponseOptional.get());
        return new ResponseEntity<>(resBody, HttpStatus.OK);
    }
}
