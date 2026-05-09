package com.ArielMelo.FightTracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record EventDTO(
        Long id,
        String name,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime date,
        String location,
        String category,
        String source,
        Long fighterId
) {}
