package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.EventDTO;
import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.mapper.EventMapper;
import com.ArielMelo.FightTracker.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public EventDTO create(@RequestBody EventDTO dto) {

        Event event = new Event();
        event.setName(dto.name());
        event.setDate(dto.date());
        event.setLocation(dto.location());

        return EventMapper.toDTO(
                eventService.createEvent(event, dto.fighterId())
        );
    }

    @GetMapping("/upcoming")
    public List<EventDTO> upcoming() {
        return eventService.getUpcomingEvents()
                .stream()
                .map(EventMapper::toDTO)
                .toList();
    }
}