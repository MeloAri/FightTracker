package com.ArielMelo.FightTracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record FightDTO(
        Long id,
        String fighter1,
        String fighter2,
        String eventName,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime eventDate,
        String category,
        String location
) {}
