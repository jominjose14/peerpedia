package com.jomin.peerpedia.service;

import com.jomin.peerpedia.data.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class StatsService {
    private final UserRepository userRepository;

    private final AtomicLong userCount = new AtomicLong();
    private final AtomicReference<List<String>> top3TeachSkills = new AtomicReference<>();
    private final AtomicReference<List<String>> top3LearnSkills = new AtomicReference<>();

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
            List<Object[]> queryResult = userRepository.findTop3TeachSkills();
            List<String> skills = new ArrayList<>(queryResult.size());
            for(Object[] row : queryResult) {
                skills.add((String)(row[0]));
            }
            this.top3TeachSkills.set(skills);
        } catch(Exception ex) {
            log.error("Failed to query top teach skills", ex);
        }

        try {
            List<Object[]> queryResult = userRepository.findTop3LearnSkills();
            List<String> skills = new ArrayList<>(queryResult.size());
            for(Object[] row : queryResult) {
                skills.add((String)(row[0]));
            }
            this.top3LearnSkills.set(skills);
        } catch(Exception ex) {
            log.error("Failed to query top learn skills", ex);
        }

        log.info("Completed running stats update");
    }

    public long getUserCount() {
        return userCount.get();
    }

    public List<String> getTop3TeachSkills() {
        return top3TeachSkills.get();
    }

    public List<String> getTop3LearnSkills() {
        return top3LearnSkills.get();
    }
}
