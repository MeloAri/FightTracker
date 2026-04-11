package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.FightDTO;
import com.ArielMelo.FightTracker.mapper.FightMapper;
import com.ArielMelo.FightTracker.service.FightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/fights")
@RequiredArgsConstructor
public class FightController {

    private final FightService fightService;

    @GetMapping("/fighter/{id}")
    public List<FightDTO> getByFighter(@PathVariable Long id) {
        return fightService.getFightsByFighter(id)
                .stream()
                .map(FightMapper::toDTO)
                .toList();
    }
}
