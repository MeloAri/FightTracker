package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.repository.EventRepository;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository   eventRepository;
    private final FighterRepository fighterRepository;
    private final NotificationService notificationService;

    /** Todos os eventos ordenados por data (sem filtro) */
    public List<Event> getUpcomingEvents() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    /** Filtrado por modalidade */
    public List<Event> getUpcomingByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCaseOrderByDateAsc(category);
    }

    /** Cadastro manual */
    public Event createEvent(Event event, Long fighterId) {
        event.setSource("MANUAL");
        if (fighterId != null) {
            Fighter fighter = fighterRepository.findById(fighterId)
                    .orElseThrow(() -> new RuntimeException("Lutador não encontrado"));
            event.setFighter(fighter);
            notificationService.notifyUsers(fighterId);
        }
        return eventRepository.save(event);
    }

    public Page<Event> getAll(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }
}
