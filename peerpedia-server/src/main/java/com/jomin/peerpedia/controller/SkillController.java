package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.data.entity.ChatMessage;
import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.SkillRepository;
import com.jomin.peerpedia.dto.ChatMessageResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/skills")
@Validated
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping(value = "/all")
    public ResponseEntity<Map<String,Object>> getAllSkills() {
        Map<String,Object> responseBody = new LinkedHashMap<>();

        List<Skill> skillRows;
        try {
            skillRows = skillRepository.findAll();
        } catch(Exception ex) {
            log.error("Failed to get all skills", ex);
            responseBody.put("success", false);
            responseBody.put("message", "Something went wrong");
            return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        List<String> skillNames = new ArrayList<>();
        for(Skill row : skillRows) {
            skillNames.add(row.getName());
        }

        responseBody.put("success", true);
        responseBody.put("message", "Fetched all skills");
        responseBody.put("payload", skillNames);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
