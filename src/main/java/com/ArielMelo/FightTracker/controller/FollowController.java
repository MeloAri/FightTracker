package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.ApiResponse;
import com.ArielMelo.FightTracker.dto.FollowDTO;
import com.ArielMelo.FightTracker.entity.Follow;
import com.ArielMelo.FightTracker.mapper.FollowMapper;
import com.ArielMelo.FightTracker.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping
    public ApiResponse follow(
            @RequestBody FollowDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        followService.followFighterByEmail(
                userDetails.getUsername(),
                dto.fighterId()
        );

        return new ApiResponse("Seguindo lutador!");
    }

    @GetMapping
    public List<FollowDTO> getFollows(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return followService.getUserFollowsByEmail(userDetails.getUsername())
                .stream()
                .map(FollowMapper::toDTO)
                .toList();
    }
}