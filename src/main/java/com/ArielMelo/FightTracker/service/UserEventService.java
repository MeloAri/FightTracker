package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Fight;
import com.ArielMelo.FightTracker.entity.Follow;
import com.ArielMelo.FightTracker.repository.FightRepository;
import com.ArielMelo.FightTracker.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserEventService {

    private final FollowRepository followRepository;
    private final FightRepository fightRepository;

    public List<Fight> getUpcomingFightsFromFollowed(Long userId) {

        List<Follow> follows = followRepository.findByUserId(userId);

        List<Long> fighterIds = follows.stream()
                .map(f -> f.getFighter().getId())
                .toList();

        return fightRepository.findAll().stream()
                .filter(fight ->
                        fighterIds.contains(fight.getFighter1().getId()) ||
                                fighterIds.contains(fight.getFighter2().getId())
                )
                .filter(fight -> fight.getEvent().getDate().isAfter(LocalDateTime.now()))
                .toList();
    }
}
