package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.EventDTO;
import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.mapper.EventMapper;
import com.ArielMelo.FightTracker.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /** POST /events — cadastro manual */
    @PostMapping
    public EventDTO create(@RequestBody EventDTO dto) {
        Event event = new Event();
        event.setName(dto.name());
        event.setDate(dto.date());
        event.setLocation(dto.location());
        event.setCategory(dto.category() != null ? dto.category() : "Outro");
        return EventMapper.toDTO(eventService.createEvent(event, dto.fighterId()));
    }

    /** GET /events/upcoming — todos os próximos eventos (sem filtro de data restrito) */
    @GetMapping("/upcoming")
    public List<EventDTO> upcoming() {
        return eventService.getUpcomingEvents()
                .stream()
                .map(EventMapper::toDTO)
                .toList();
    }

    /** GET /events/upcoming/category?category=MMA */
    @GetMapping("/upcoming/category")
    public List<EventDTO> upcomingByCategory(@RequestParam String category) {
        return eventService.getUpcomingByCategory(category)
                .stream()
                .map(EventMapper::toDTO)
                .toList();
    }

    /** GET /events — todos (admin/debug) */
    @GetMapping
    public Page<EventDTO> getAll(Pageable pageable) {
        return eventService.getAll(pageable).map(EventMapper::toDTO);
    }
}
