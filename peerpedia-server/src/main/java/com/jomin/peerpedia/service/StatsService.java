package com.jomin.peerpedia.service;

import com.jomin.peerpedia.data.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class StatsService {
    private final UserRepository userRepository;

    private final AtomicLong userCount = new AtomicLong();
    private final AtomicReference<Map<String,Long>> topTeachSkills = new AtomicReference<>();
    private final AtomicReference<Map<String,Long>> topLearnSkills = new AtomicReference<>();

    public StatsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // performed once in every 24h
    @Scheduled(fixedRate = 86400000)
    public void updateStats() {
        log.info("Started running stats update");

        try {
            userCount.set(userRepository.count());
        } catch(Exception ex) {
            log.error("Failed to query user count", ex);
        }

        try {
            List<Object[]> queryResult = userRepository.findTop5TeachSkills();
            Map<String,Long> skills = new LinkedHashMap<>();
            for(Object[] row : queryResult) {
                skills.put((String)(row[0]), (Long)(row[1]));
            }
            this.topTeachSkills.set(skills);
        } catch(Exception ex) {
            log.error("Failed to query top teach skills", ex);
        }

        try {
            List<Object[]> queryResult = userRepository.findTop5LearnSkills();
            Map<String,Long> skills = new LinkedHashMap<>();
            for(Object[] row : queryResult) {
                skills.put((String)(row[0]), (Long)(row[1]));
            }
            this.topLearnSkills.set(skills);
        } catch(Exception ex) {
            log.error("Failed to query top learn skills", ex);
        }

        log.info("Completed running stats update");
    }

    public long getUserCount() {
        return userCount.get();
    }

    public Map<String,Long> getTopTeachSkills() {
        return topTeachSkills.get();
    }

    public Map<String,Long> getTopLearnSkills() {
        return topLearnSkills.get();
    }
}
