package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.repository.EventRepository;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final FighterRepository fighterRepository;
    private final NotificationService notificationService;

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDateTime.now());
    }

    public Event createEvent(Event event, Long fighterId) {

        Fighter fighter = fighterRepository.findById(fighterId)
                .orElseThrow(() -> new RuntimeException("Lutador não encontrado"));

        event.setFighter(fighter);

        Event saved = eventRepository.save(event);


        notificationService.notifyUsers(fighterId);

        return saved;
    }
}