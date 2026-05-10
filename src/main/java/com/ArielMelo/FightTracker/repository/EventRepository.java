package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByDateAfter(LocalDateTime date);

    List<Event> findByDateBetween(LocalDateTime start, LocalDateTime end);
}
