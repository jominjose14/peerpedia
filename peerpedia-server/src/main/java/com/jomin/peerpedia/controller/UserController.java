package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.dto.UpdateUserRequest;
import com.jomin.peerpedia.dto.UserResponse;
import com.jomin.peerpedia.service.SkillService;
import com.jomin.peerpedia.service.StatsService;
import com.jomin.peerpedia.service.UserService;
import jakarta.validation.constraints.*;
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
@RequestMapping("/users")
@Validated
public class UserController {

    private final UserService userService;
    private final SkillService skillService;
    private final StatsService statsService;

    @GetMapping(value = "/self")
    public ResponseEntity<Map<String,Object>> getCurrentUser() {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<UserResponse> userResponseOptional = userService.getCurrent();
        if(userResponseOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch logged in user");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched logged in user");
        responseBody.put("payload", userResponseOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/by-id/{id}")
    public ResponseEntity<Map<String,Object>> getUserById(@PathVariable("id") @NotNull @Min(1) @Max(1000000) Long id) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<UserResponse> userResponseOptional = userService.get(id);
        if(userResponseOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "User does not exist");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched user");
        responseBody.put("payload", userResponseOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @PostMapping("/self")
    public ResponseEntity<Map<String,Object>> updateCurrentUser(@RequestBody UpdateUserRequest requestBody) {
        Map<String,Object> responseBody = new LinkedHashMap<>();

        for(String skill : requestBody.getTeachSkills()) {
            Optional<Skill> skillOptional = skillService.get(skill);
            if(skillOptional.isEmpty()) {
                responseBody.put("success", false);
                responseBody.put("message", String.format("Invalid teach skill %s", skill));
                return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
            }
        }

        for(String skill : requestBody.getLearnSkills()) {
            Optional<Skill> skillOptional = skillService.get(skill);
            if(skillOptional.isEmpty()) {
                responseBody.put("success", false);
                responseBody.put("message", String.format("Invalid learn skill %s", skill));
                return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
            }
        }

        Optional<UserResponse> userResponseOptional = userService.updateCurrent(requestBody);
        if(userResponseOptional.isEmpty()) {
            log.error("Failed to update user");
            responseBody.put("success", false);
            responseBody.put("message", "Something went wrong");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Updated user");
        responseBody.put("payload", userResponseOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/explore", params = {"username", "teach", "learn", "count"})
    public ResponseEntity<Map<String,Object>> getPeers(@RequestParam("username") @NotNull @Size(min=0, max=32) String username, @RequestParam("teach") @NotNull @Size(min=0, max=10) List<String> teachSkills, @RequestParam("learn") @NotNull @Size(min=0, max=10) List<String> learnSkills, @RequestParam("count") @NotNull @Min(1) @Max(100) int count) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<UserResponse>> userResponsesOptional = userService.getPeers(username, teachSkills, learnSkills, count);
        if(userResponsesOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch peers");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers");
        responseBody.put("payload", userResponsesOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/teach", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getPeersToTeach(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<UserResponse>> userResponsesOptional = userService.getPeersToTeach(startId, endId);
        if(userResponsesOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch peers to teach");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers to teach");
        responseBody.put("payload", userResponsesOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/learn", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getPeersToLearnFrom(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<UserResponse>> userResponsesOptional = userService.getPeersToLearnFrom(startId, endId);
        if(userResponsesOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch peers to learn from");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers to learn from");
        responseBody.put("payload", userResponsesOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/match", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getMatchedPeers(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<UserResponse>> userResponsesOptional = userService.getMatchedPeers(startId, endId);
        if(userResponsesOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch matched peers");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched matched peers");
        responseBody.put("payload", userResponsesOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/contacts", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getContacts(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<List<UserResponse>> userResponsesOptional = userService.getContacts(startId, endId);
        if(userResponsesOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "Failed to fetch contacts");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched contacts");
        responseBody.put("payload", userResponsesOptional.get());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/stats/count")
    public ResponseEntity<Map<String,Object>> getUserCount() {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched user count");
        responseBody.put("payload", statsService.getUserCount());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/stats/teach")
    public ResponseEntity<Map<String,Object>> getTopTeachSkills() {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched top teach skills");
        responseBody.put("payload", statsService.getTopTeachSkills());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/stats/learn")
    public ResponseEntity<Map<String,Object>> getTopLearnSkills() {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched top learn skills");
        responseBody.put("payload", statsService.getTopLearnSkills());
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
