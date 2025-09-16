package com.jomin.peerpedia.data.repository;

import com.jomin.peerpedia.data.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query(value = """
        SELECT *
        FROM users u
        WHERE u.username LIKE :username
        AND u.id <> :excludeId
        AND (:teachSkills = '' OR u.teach_skills && CAST(:teachSkills AS varchar[]))
        AND (:learnSkills = '' OR u.learn_skills && CAST(:learnSkills AS varchar[]))
        ORDER BY u.id DESC
        LIMIT :count
        """, nativeQuery = true)
    List<User> findPeersByUsernameAndTeachSkillsAndLearnSkills(String username, Long excludeId, String teachSkills, String learnSkills, int count);

    @Query(value = """
        SELECT *
        FROM users u
        WHERE u.id BETWEEN :startId AND :endId
        AND u.id <> :excludeId
        AND u.learn_skills && CAST(:teachSkills AS varchar[])
        ORDER BY u.id DESC
        LIMIT 10
        """, nativeQuery = true)
    List<User> findTop10PeersToTeach(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("teachSkills") String teachSkills);

    @Query(value = """
        SELECT *
        FROM users u
        WHERE u.id BETWEEN :startId AND :endId
        AND u.id <> :excludeId
        AND u.teach_skills && CAST(:learnSkills AS varchar[])
        ORDER BY u.id DESC
        LIMIT 10
        """, nativeQuery = true)
    List<User> findTop10PeersToLearnFrom(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("learnSkills") String learnSkills);

    @Query(value = """
        SELECT *
        FROM users u
        WHERE u.id BETWEEN :startId AND :endId
        AND u.id <> :excludeId
        AND u.learn_skills && CAST(:teachSkills AS varchar[])
        AND u.teach_skills && CAST(:learnSkills AS varchar[])
        ORDER BY u.id DESC
        LIMIT 10
        """, nativeQuery = true)
    List<User> findTop10MatchedPeers(@Param("startId") Long startId, @Param("endId") Long endId, @Param("excludeId") Long excludeId, @Param("teachSkills") String teachSkills, @Param("learnSkills") String learnSkills);

    @Query(value = """
        SELECT *
        FROM users u
        WHERE u.id BETWEEN :startId AND :endId
        AND u.id <> :selfId
        AND u.id IN (
            SELECT DISTINCT c.from_id
            FROM "chat-messages" c
            WHERE c.to_id = :selfId
            UNION
            SELECT DISTINCT c.to_id
            FROM "chat-messages" c
            WHERE c.from_id = :selfId
        )
        ORDER BY u.id DESC
        LIMIT 10
        """, nativeQuery = true)
    List<User> find10Contacts(@Param("startId") Long startId, @Param("endId") Long endId, @Param("selfId") Long selfId);

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
