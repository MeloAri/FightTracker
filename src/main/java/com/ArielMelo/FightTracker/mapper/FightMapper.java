package com.ArielMelo.FightTracker.mapper;


import com.ArielMelo.FightTracker.dto.FightDTO;
import com.ArielMelo.FightTracker.entity.Fight;

public class FightMapper {

    public static FightDTO toDTO(Fight fight) {
        return new FightDTO(
                fight.getId(),
                fight.getFighter1().getName(),
                fight.getFighter2().getName(),
                fight.getEvent().getName(),
                fight.getEvent().getDate()
        );
    }
}
