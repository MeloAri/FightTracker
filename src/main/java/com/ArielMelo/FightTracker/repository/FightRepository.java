package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Fight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FightRepository extends JpaRepository<Fight, Long> {

    List<Fight> findByFighter1IdOrFighter2Id(Long fighter1Id, Long fighter2Id);

}