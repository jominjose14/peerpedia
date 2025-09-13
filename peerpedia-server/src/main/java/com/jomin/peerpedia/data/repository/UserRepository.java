package com.jomin.peerpedia.data.repository;

import com.jomin.peerpedia.data.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findTop10ByIdBetweenAndIdNotOrderByIdDesc(Long startId, Long endId, Long excludeId);

    @Query(value = """
            SELECT * FROM users u WHERE u.id BETWEEN :startId AND :endId
            AND u.id <> :excludeId
            AND u.learn_skills && CAST(:teachSkills AS varchar[])
            ORDER BY u.id DESC LIMIT 10
            """, nativeQuery = true)
    List<User> findTop10PeersToTeach(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("teachSkills") String teachSkills);

    @Query(value = """
            SELECT * FROM users u WHERE u.id BETWEEN :startId AND :endId
            AND u.id <> :excludeId
            AND u.teach_skills && CAST(:learnSkills AS varchar[])
            ORDER BY u.id DESC LIMIT 10
            """, nativeQuery = true)
    List<User> findTop10PeersToLearnFrom(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("learnSkills") String learnSkills);

    @Query(value = """
            SELECT * FROM users u WHERE u.id BETWEEN :startId AND :endId
            AND u.id <> :excludeId
            AND u.learn_skills && CAST(:teachSkills AS varchar[])
            AND u.teach_skills && CAST(:learnSkills AS varchar[])
            ORDER BY u.id DESC LIMIT 10
            """, nativeQuery = true)
    List<User> findTop10MatchedPeers(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("teachSkills") String teachSkills, @Param("learnSkills") String learnSkills);

    @Query(value = """
        SELECT skill, COUNT(*) as freq
        FROM (
            SELECT unnest(teach_skills) as skill
            FROM users
        ) AS unnested_table
        GROUP BY skill
        ORDER BY freq DESC
        LIMIT 5
        """, nativeQuery = true)
    List<Object[]> findTop5TeachSkills();

    @Query(value = """
        SELECT skill, COUNT(*) as freq
        FROM (
            SELECT unnest(learn_skills) as skill
            FROM users
        ) AS unnested_table
        GROUP BY skill
        ORDER BY freq DESC
        LIMIT 5
        """, nativeQuery = true)
    List<Object[]> findTop5LearnSkills();
}
