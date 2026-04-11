package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.FightDTO;
import com.ArielMelo.FightTracker.mapper.FightMapper;
import com.ArielMelo.FightTracker.service.UserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user-events")
@RequiredArgsConstructor
public class UserEventController {

    private final UserEventService userEventService;

    @GetMapping("/{userId}")
    public List<FightDTO> getUserEvents(@PathVariable Long userId) {
        return userEventService.getUpcomingFightsFromFollowed(userId)
                .stream()
                .map(FightMapper::toDTO)
                .toList();
    }
}
