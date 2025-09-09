package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.UserRepository;
import com.jomin.peerpedia.dto.LoginRequest;
import com.jomin.peerpedia.dto.SignupRequest;
import com.jomin.peerpedia.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtProvider jwtProvider, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            Map<String,Object> resBody = new LinkedHashMap<>();
            resBody.put("success", false);
            resBody.put("message", "Username is already taken");
            return new ResponseEntity<>(resBody, HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        userRepository.save(user);

        Map<String,Object> resBody = new LinkedHashMap<>();
        resBody.put("success", true);
        resBody.put("message", "User registered successfully");
        return new ResponseEntity<>(resBody, HttpStatus.OK);
    }
}
