package com.jomin.peerpedia.controller;

import com.jomin.peerpedia.dto.PopulateRequest;
import com.jomin.peerpedia.dto.UserResponse;
import com.jomin.peerpedia.service.PopulationService;
import com.jomin.peerpedia.service.StatsService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin")
@Validated
public class AdminController {

    @Value("${app.admin.password}")
    private String adminPassword;

    @Autowired
    private PopulationService populationService;

    @Autowired
    private StatsService statsService;

    @PostMapping(value = "/populate")
    public ResponseEntity<Map<String,Object>> populateDatabase(@RequestBody PopulateRequest requestBody) {
        log.debug("Admin request received to populate database");
        Map<String,Object> responseBody = new LinkedHashMap<>();

        if(!requestBody.getPassword().equals(adminPassword)) {
            responseBody.put("success", false);
            responseBody.put("message", "Wrong password");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        Map<String, Long> populationResponse = populationService.populate();
        statsService.updateStats();

        responseBody.put("success", true);
        responseBody.put("message", "Database population complete");
        responseBody.put("payload", populationResponse);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

}
