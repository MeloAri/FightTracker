package com.ArielMelo.FightTracker.repository;

import com.ArielMelo.FightTracker.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Busca todos os eventos futuros
    List<Event> findByDateAfterOrderByDateAsc(LocalDateTime date);

    // Busca todos os eventos — sem filtro de data
    List<Event> findAllByOrderByDateAsc();

    // Busca por categoria sem filtro de data
    List<Event> findByCategoryIgnoreCaseOrderByDateAsc(String category);

    // Verifica duplicata por externalId
    boolean existsByExternalId(String externalId);
}
