package com.jomin.peerpedia.service;

import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.data.repository.SkillRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    @Cacheable(value = "skills", unless = "#result == null")
    public Optional<Skill> get(String name) {
        return skillRepository.findByName(name);
    }

    @Cacheable("skills")
    public List<Skill> getAll() {
        return skillRepository.findAll();
    }
}
