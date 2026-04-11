package com.ArielMelo.FightTracker.dto;

import java.time.LocalDateTime;

public record EventDTO(
        Long id,
        String name,
        LocalDateTime date,
        String location,
        Long fighterId
) {}
