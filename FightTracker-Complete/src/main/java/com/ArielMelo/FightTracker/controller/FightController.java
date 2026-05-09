package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.FightDTO;
import com.ArielMelo.FightTracker.mapper.FightMapper;
import com.ArielMelo.FightTracker.service.FightService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fights")
@RequiredArgsConstructor
public class FightController {

    private final FightService fightService;

    /** GET /fights — todas as lutas paginadas */
    @GetMapping
    public Page<FightDTO> getAll(Pageable pageable) {
        return fightService.getAll(pageable).map(FightMapper::toDTO);
    }

    /** GET /fights?category=MMA — filtrado por modalidade */
    @GetMapping("/category")
    public Page<FightDTO> getByCategory(@RequestParam String category, Pageable pageable) {
        return fightService.getByCategory(category, pageable).map(FightMapper::toDTO);
    }

    /** GET /fights/fighter/:id */
    @GetMapping("/fighter/{fighterId}")
    public List<FightDTO> getByFighter(@PathVariable Long fighterId) {
        return fightService.getFightsByFighter(fighterId)
                .stream().map(FightMapper::toDTO).toList();
    }
}
