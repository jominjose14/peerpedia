package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.bean.RequestLocal;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.data.repository.SkillRepository;
import com.jomin.peerpedia.data.repository.UserRepository;
import com.jomin.peerpedia.dto.UpdateUserRequest;
import com.jomin.peerpedia.dto.UserResponse;
import com.jomin.peerpedia.service.StatsService;
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
@RequestMapping("/users")
@Validated
public class UserController {

    private final RequestLocal requestLocal;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final StatsService statsService;

    @GetMapping(value = "/self")
    public ResponseEntity<Map<String,Object>> getCurrentUser() {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched logged in user");
        responseBody.put("payload", new UserResponse(requestLocal.getCurrentUser()));
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/by-id/{id}")
    public ResponseEntity<Map<String,Object>> getUserById(@PathVariable("id") @NotNull @Min(1) @Max(1000000) Long id) {
        Map<String,Object> responseBody = new LinkedHashMap<>();
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isEmpty()) {
            responseBody.put("success", false);
            responseBody.put("message", "User does not exist");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched user");
        responseBody.put("payload", new UserResponse(userOptional.get()));
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @PostMapping("/self")
    public ResponseEntity<Map<String,Object>> updateCurrentUser(@RequestBody UpdateUserRequest requestBody) {
        Map<String,Object> responseBody = new LinkedHashMap<>();

        for(String skill : requestBody.getTeachSkills()) {
            Optional<Skill> skillOptional = skillRepository.findByName(skill);
            if(skillOptional.isEmpty()) {
                responseBody.put("success", false);
                responseBody.put("message", String.format("Invalid teach skill %s", skill));
                return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
            }
        }

        for(String skill : requestBody.getLearnSkills()) {
            Optional<Skill> skillOptional = skillRepository.findByName(skill);
            if(skillOptional.isEmpty()) {
                responseBody.put("success", false);
                responseBody.put("message", String.format("Invalid learn skill %s", skill));
                return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
            }
        }

        User user = requestLocal.getCurrentUser();
        user.update(requestBody);

        try {
            userRepository.save(user);
            responseBody.put("success", true);
            responseBody.put("message", "Updated user");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch(Exception ex) {
            log.error("Failed to update user", ex);
            responseBody.put("success", false);
            responseBody.put("message", "Something went wrong");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/all", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getPeers(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        User currentUser = requestLocal.getCurrentUser();
        List<User> userRows = userRepository.findTop10ByIdBetweenAndIdNotOrderByIdDesc(startId, endId, currentUser.getId());
        List<UserResponse> users = new ArrayList<>(userRows.size());
        for(var userRow : userRows) {
            users.add(new UserResponse(userRow));
        }

        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers");
        responseBody.put("payload", users);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/teach", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getPeersToTeach(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        User currentUser = requestLocal.getCurrentUser();
        String teachSkillsArray = "{" + String.join(",", currentUser.getTeachSkills()) + "}";
        List<User> userRows = userRepository.findTop10PeersToTeach(startId, endId, currentUser.getId(), teachSkillsArray);
        List<UserResponse> users = new ArrayList<>(userRows.size());
        for(var userRow : userRows) {
            users.add(new UserResponse(userRow));
        }

        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers to teach");
        responseBody.put("payload", users);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/learn", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getPeersToLearnFrom(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        User currentUser = requestLocal.getCurrentUser();
        String learnSkillsArray = "{" + String.join(",", currentUser.getLearnSkills()) + "}";
        List<User> userRows = userRepository.findTop10PeersToLearnFrom(startId, endId, currentUser.getId(), learnSkillsArray);
        List<UserResponse> users = new ArrayList<>(userRows.size());
        for(var userRow : userRows) {
            users.add(new UserResponse(userRow));
        }

        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched peers to learn from");
        responseBody.put("payload", users);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping(value = "/match", params = {"start", "end"})
    public ResponseEntity<Map<String,Object>> getMatchedPeers(@RequestParam("start") @NotNull @Min(1) @Max(1000000) Long startId, @RequestParam("end") @NotNull @Min(1) @Max(1000000) Long endId) {
        User currentUser = requestLocal.getCurrentUser();
        String teachSkillsArray = "{" + String.join(",", currentUser.getTeachSkills()) + "}";
        String learnSkillsArray = "{" + String.join(",", currentUser.getLearnSkills()) + "}";
        List<User> userRows = userRepository.findTop10MatchedPeers(startId, endId, currentUser.getId(), teachSkillsArray, learnSkillsArray);
        List<UserResponse> users = new ArrayList<>(userRows.size());
        for(var userRow : userRows) {
            users.add(new UserResponse(userRow));
        }

        Map<String,Object> responseBody = new LinkedHashMap<>();
        responseBody.put("success", true);
        responseBody.put("message", "Fetched matched peers");
        responseBody.put("payload", users);
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
