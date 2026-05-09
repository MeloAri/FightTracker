package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByUserId(Long userId);

    List<Follow> findByFighterId(Long fighterId);

    boolean existsByUserIdAndFighterId(Long userId, Long fighterId);
}
