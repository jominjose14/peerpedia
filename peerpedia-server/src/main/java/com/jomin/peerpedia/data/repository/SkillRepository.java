package com.jomin.peerpedia.data.repository;

import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.data.entity.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name);
}
