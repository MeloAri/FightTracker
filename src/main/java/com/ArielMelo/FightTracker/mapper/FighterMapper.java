package com.ArielMelo.FightTracker.mapper;


import com.ArielMelo.FightTracker.dto.FighterDTO;
import com.ArielMelo.FightTracker.entity.Fighter;

public class FighterMapper {

    public static FighterDTO toDTO(Fighter fighter) {
        return new FighterDTO(
                fighter.getId(),
                fighter.getName(),
                fighter.getCategory()
        );
    }

    public static Fighter toEntity(FighterDTO dto) {
        Fighter fighter = new Fighter();
        fighter.setName(dto.name());
        fighter.setCategory(dto.category());
        return fighter;
    }
}
