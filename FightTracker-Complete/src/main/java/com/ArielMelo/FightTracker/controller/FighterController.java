package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.FighterDTO;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.mapper.FighterMapper;
import com.ArielMelo.FightTracker.service.FighterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fighters")
@RequiredArgsConstructor
public class FighterController {

    private final FighterService fighterService;

    @PostMapping
    public FighterDTO create(@RequestBody @Valid FighterDTO dto) {
        Fighter fighter = FighterMapper.toEntity(dto);
        return FighterMapper.toDTO(fighterService.createFighter(fighter));
    }

    /** GET /fighters — lista paginada */
    @GetMapping
    public Page<FighterDTO> getAll(Pageable pageable) {
        return fighterService.getAll(pageable).map(FighterMapper::toDTO);
    }

    /** GET /fighters/search?name=islam — busca por nome */
    @GetMapping("/search")
    public List<FighterDTO> search(@RequestParam String name) {
        return fighterService.searchByName(name)
                .stream().map(FighterMapper::toDTO).toList();
    }

    /** GET /fighters/category?category=MMA — busca por modalidade */
    @GetMapping("/category")
    public List<FighterDTO> getByCategory(@RequestParam String category) {
        return fighterService.findByCategory(category)
                .stream().map(FighterMapper::toDTO).toList();
    }
}
