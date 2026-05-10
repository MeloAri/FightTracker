package com.ArielMelo.FightTracker.dto;

import java.time.LocalDateTime;

public record FightDTO(Long id,
                       String fighter1,
                       String fighter2,
                       String eventName,
                       LocalDateTime eventDate) {
}
