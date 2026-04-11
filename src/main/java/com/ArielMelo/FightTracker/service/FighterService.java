package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FighterService {

    private final FighterRepository fighterRepository;

    public Fighter createFighter(Fighter fighter) {
        return fighterRepository.save(fighter);
    }

    public List<Fighter> searchByName(String name) {
        return fighterRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Fighter> findByCategory(String category) {
        return fighterRepository.findByCategoryIgnoreCase(category);
    }

    public Fighter findById(Long id) {
        return fighterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fighter não encontrado"));
    }
}
