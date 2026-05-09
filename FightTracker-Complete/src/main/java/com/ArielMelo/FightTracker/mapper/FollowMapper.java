package com.ArielMelo.FightTracker.mapper;

import com.ArielMelo.FightTracker.dto.FollowDTO;
import com.ArielMelo.FightTracker.entity.Follow;

public class FollowMapper {

    public static FollowDTO toDTO(Follow follow) {
        return new FollowDTO(
                follow.getId(),
                follow.getFighter().getId(),
                follow.getFighter().getName()
        );
    }
}
