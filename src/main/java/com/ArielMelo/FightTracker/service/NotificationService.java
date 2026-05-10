package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Follow;
import com.ArielMelo.FightTracker.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final FollowRepository followRepository;

    public void notifyUsers(Long fighterId) {

        List<Follow> follows = followRepository.findByFighterId(fighterId);

        for (Follow follow : follows) {
            System.out.println("Notificar usuário: " + follow.getUser().getEmail());
        }
    }
}
