package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.entity.Follow;
import com.ArielMelo.FightTracker.entity.User;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import com.ArielMelo.FightTracker.repository.FollowRepository;
import com.ArielMelo.FightTracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final FighterRepository fighterRepository;

    public void followFighterByEmail(String email, Long fighterId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Fighter fighter = fighterRepository.findById(fighterId)
                .orElseThrow(() -> new RuntimeException("Lutador não encontrado"));

        if (followRepository.existsByUserIdAndFighterId(user.getId(), fighterId)) {
            throw new RuntimeException("Você já segue esse lutador");
        }

        Follow follow = Follow.builder()
                .user(user)
                .fighter(fighter)
                .build();

        followRepository.save(follow);
    }

    public List<Follow> getUserFollowsByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return followRepository.findByUserId(user.getId());
    }
}