package com.ArielMelo.FightTracker.mapper;

import com.ArielMelo.FightTracker.dto.EventDTO;
import com.ArielMelo.FightTracker.entity.Event;

public class EventMapper {

    public static EventDTO toDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getName(),
                event.getDate(),
                event.getLocation(),
                event.getCategory(),
                event.getSource(),
                event.getFighter() != null ? event.getFighter().getId() : null
        );
    }
}
