package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, Long> {
}
