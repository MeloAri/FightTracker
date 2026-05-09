package com.ArielMelo.FightTracker.mapper;

import com.ArielMelo.FightTracker.dto.FightDTO;
import com.ArielMelo.FightTracker.entity.Fight;

public class FightMapper {

    public static FightDTO toDTO(Fight fight) {
        String category = fight.getEvent() != null ? fight.getEvent().getCategory() : null;
        String location = fight.getEvent() != null ? fight.getEvent().getLocation() : null;
        return new FightDTO(
                fight.getId(),
                fight.getFighter1().getName(),
                fight.getFighter2().getName(),
                fight.getEvent() != null ? fight.getEvent().getName() : "",
                fight.getEvent() != null ? fight.getEvent().getDate() : null,
                category,
                location
        );
    }
}
