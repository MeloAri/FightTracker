package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Fight;
import com.ArielMelo.FightTracker.repository.FightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FightService {

    private final FightRepository fightRepository;

    public Page<Fight> getAll(Pageable pageable) {
        return fightRepository.findAll(pageable);
    }

    public Page<Fight> getByCategory(String category, Pageable pageable) {
        return fightRepository.findByCategory(category, pageable);
    }

    public List<Fight> getFightsByFighter(Long fighterId) {
        return fightRepository.findByFighter1IdOrFighter2Id(fighterId, fighterId);
    }
}
