package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.FighterDTO;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.mapper.FighterMapper;
import com.ArielMelo.FightTracker.service.FighterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fighters")
@RequiredArgsConstructor
public class FighterController {

    private final FighterService fighterService;

    @PostMapping
    public FighterDTO create(@RequestBody FighterDTO dto) {
        Fighter fighter = new Fighter();
        fighter.setName(dto.name());
        fighter.setCategory(dto.category());

        return FighterMapper.toDTO(fighterService.createFighter(fighter));
    }

    @GetMapping("/search")
    public List<FighterDTO> search(@RequestParam String name) {
        return fighterService.searchByName(name)
                .stream()
                .map(FighterMapper::toDTO)
                .toList();
    }
}
