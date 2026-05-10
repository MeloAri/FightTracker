package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Fighter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FighterRepository extends JpaRepository<Fighter, Long> {

    List<Fighter> findByNameContainingIgnoreCase(String name);

    List<Fighter> findByCategoryIgnoreCase(String category);
}
