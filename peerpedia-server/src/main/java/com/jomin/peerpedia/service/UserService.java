package com.jomin.peerpedia.service;

import com.jomin.peerpedia.bean.RequestLocal;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.UserRepository;
import com.jomin.peerpedia.dto.SignupRequest;
import com.jomin.peerpedia.dto.UpdateUserRequest;
import com.jomin.peerpedia.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RequestLocal requestLocal;
    private final PasswordEncoder passwordEncoder;

    public Optional<UserResponse> getCurrent() {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        return currentUserOptional.map(UserResponse::new);
    }

    @Cacheable(value = "users", unless = "#result == null")
    public Optional<UserResponse> get(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(UserResponse::new);
    }

    @Cacheable(value = "users", unless = "#result == null")
    public Optional<UserResponse> get(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.map(UserResponse::new);
    }

    // @Cacheable(value = "users", key ="#id + '::row'", unless = "#result == null")
    public Optional<User> getRow(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getCurrentUserRow() {
        return Optional.ofNullable(requestLocal.getCurrentUser());
    }

    public Optional<List<UserResponse>> getPeers(Long startId, Long endId) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User currentUser = currentUserOptional.get();
        List<User> rows = userRepository.findTop10ByIdBetweenAndIdNotOrderByIdDesc(startId, endId, currentUser.getId());

        List<UserResponse> userResponses = new ArrayList<>(rows.size());
        for(var row : rows) {
            userResponses.add(new UserResponse(row));
        }

        return Optional.of(userResponses);
    }

    public Optional<List<UserResponse>> getPeersToTeach(Long startId, Long endId) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User currentUser = currentUserOptional.get();
        String teachSkillsArray = "{" + String.join(",", currentUser.getTeachSkills()) + "}";
        List<User> rows = userRepository.findTop10PeersToTeach(startId, endId, currentUser.getId(), teachSkillsArray);

        List<UserResponse> userResponses = new ArrayList<>(rows.size());
        for(var row : rows) {
            userResponses.add(new UserResponse(row));
        }

        return Optional.of(userResponses);
    }

    public Optional<List<UserResponse>> getPeersToLearnFrom(Long startId, Long endId) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User currentUser = currentUserOptional.get();
        String learnSkillsArray = "{" + String.join(",", currentUser.getLearnSkills()) + "}";
        List<User> rows = userRepository.findTop10PeersToLearnFrom(startId, endId, currentUser.getId(), learnSkillsArray);

        List<UserResponse> userResponses = new ArrayList<>(rows.size());
        for(var row : rows) {
            userResponses.add(new UserResponse(row));
        }

        return Optional.of(userResponses);
    }

    public Optional<List<UserResponse>> getMatchedPeers(Long startId, Long endId) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User currentUser = currentUserOptional.get();
        String teachSkillsArray = "{" + String.join(",", currentUser.getTeachSkills()) + "}";
        String learnSkillsArray = "{" + String.join(",", currentUser.getLearnSkills()) + "}";
        List<User> rows = userRepository.findTop10MatchedPeers(startId, endId, currentUser.getId(), teachSkillsArray, learnSkillsArray);

        List<UserResponse> userResponses = new ArrayList<>(rows.size());
        for(var row : rows) {
            userResponses.add(new UserResponse(row));
        }

        return Optional.of(userResponses);
    }

    public Optional<UserResponse> create(SignupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        User createdUser = userRepository.save(user);
        return Optional.of(new UserResponse(createdUser));
    }

    public Optional<UserResponse> updateCurrent(UpdateUserRequest updateUserRequest) {
        Optional<User> currentUserOptional = Optional.ofNullable(requestLocal.getCurrentUser());
        if(currentUserOptional.isEmpty()) return Optional.empty();

        User user = currentUserOptional.get();
        user.update(updateUserRequest);
        User updatedUser = userRepository.save(user);
        return Optional.of(new UserResponse(updatedUser));
    }
}
