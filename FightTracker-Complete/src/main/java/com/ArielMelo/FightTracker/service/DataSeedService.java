package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.entity.Fight;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.repository.EventRepository;
import com.ArielMelo.FightTracker.repository.FightRepository;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Popula o banco com dados reais de lutadores e eventos
 * na primeira execução. Garante que sempre haja conteúdo
 * independente das APIs externas.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DataSeedService implements ApplicationRunner {

    private final FighterRepository fighterRepository;
    private final EventRepository   eventRepository;
    private final FightRepository   fightRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (fighterRepository.count() > 10) {
            log.info("Seed já executado, pulando...");
            return;
        }
        log.info("▶ Executando seed de dados iniciais...");
        seedFighters();
        seedEvents();
        seedFights();
        log.info("✅ Seed concluído — {} lutadores, {} eventos, {} lutas",
                fighterRepository.count(), eventRepository.count(), fightRepository.count());
    }

    private void seedFighters() {
        List<String[]> fighters = List.of(
            // {nome, categoria}
            // MMA
            new String[]{"Islam Makhachev", "MMA"},
            new String[]{"Alex Pereira", "MMA"},
            new String[]{"Jon Jones", "MMA"},
            new String[]{"Ilia Topuria", "MMA"},
            new String[]{"Dricus Du Plessis", "MMA"},
            new String[]{"Sean O'Malley", "MMA"},
            new String[]{"Charles Oliveira", "MMA"},
            new String[]{"Dustin Poirier", "MMA"},
            new String[]{"Conor McGregor", "MMA"},
            new String[]{"Israel Adesanya", "MMA"},
            new String[]{"Magomed Ankalaev", "MMA"},
            new String[]{"Tom Aspinall", "MMA"},
            new String[]{"Ciryl Gane", "MMA"},
            new String[]{"Max Holloway", "MMA"},
            new String[]{"Justin Gaethje", "MMA"},
            new String[]{"Gilbert Burns", "MMA"},
            new String[]{"Caio Borralho", "MMA"},
            new String[]{"Alexandre Pantoja", "MMA"},
            // Boxe
            new String[]{"Canelo Álvarez", "Boxe"},
            new String[]{"Tyson Fury", "Boxe"},
            new String[]{"Oleksandr Usyk", "Boxe"},
            new String[]{"Anthony Joshua", "Boxe"},
            new String[]{"Deontay Wilder", "Boxe"},
            new String[]{"Naoya Inoue", "Boxe"},
            new String[]{"Gervonta Davis", "Boxe"},
            new String[]{"Ryan Garcia", "Boxe"},
            new String[]{"Errol Spence Jr.", "Boxe"},
            new String[]{"Terence Crawford", "Boxe"},
            // Jiu-Jitsu
            new String[]{"Gordon Ryan", "Jiu-Jitsu"},
            new String[]{"Craig Jones", "Jiu-Jitsu"},
            new String[]{"Nicholas Meregali", "Jiu-Jitsu"},
            new String[]{"Felipe Pena", "Jiu-Jitsu"},
            new String[]{"Kaynan Duarte", "Jiu-Jitsu"},
            new String[]{"Mikey Musumeci", "Jiu-Jitsu"},
            // Muay Thai
            new String[]{"Rodtang Jitmuangnon", "Muay Thai"},
            new String[]{"Nong-O Hama", "Muay Thai"},
            new String[]{"Superbon", "Muay Thai"},
            new String[]{"Tawanchai PK Saenchai", "Muay Thai"},
            // Kickboxing
            new String[]{"Rico Verhoeven", "Kickboxing"},
            new String[]{"Badr Hari", "Kickboxing"},
            new String[]{"Liam Harrison", "Kickboxing"}
        );

        for (String[] f : fighters) {
            if (fighterRepository.findByNameContainingIgnoreCase(f[0]).isEmpty()) {
                Fighter fighter = new Fighter();
                fighter.setName(f[0]);
                fighter.setCategory(f[1]);
                fighterRepository.save(fighter);
            }
        }
        log.info("Seed fighters: {} cadastrados", fighterRepository.count());
    }

    private void seedEvents() {
        List<String[]> events = List.of(
            // {externalId, nome, data, local, categoria}
            new String[]{"SEED-MMA-001", "UFC 315: Makhachev vs Poirier",
                    "2026-05-10T23:00:00", "Abu Dhabi, UAE", "MMA"},
            new String[]{"SEED-MMA-002", "UFC Fight Night: Pereira vs Ankalaev 2",
                    "2026-05-24T20:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"SEED-MMA-003", "UFC 316: O'Malley vs Dvalishvili 2",
                    "2026-06-07T23:00:00", "Newark, USA", "MMA"},
            new String[]{"SEED-MMA-004", "UFC Fight Night: Holloway vs Gaethje 2",
                    "2026-06-21T20:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"SEED-MMA-005", "UFC 317: Jones vs Aspinall",
                    "2026-07-05T23:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"SEED-BOX-001", "Canelo vs Benavidez",
                    "2026-05-17T23:00:00", "Las Vegas, USA", "Boxe"},
            new String[]{"SEED-BOX-002", "Usyk vs Fury 3",
                    "2026-06-14T22:00:00", "Riyadh, Saudi Arabia", "Boxe"},
            new String[]{"SEED-BOX-003", "Inoue vs Nery 2",
                    "2026-05-30T21:00:00", "Tokyo, Japan", "Boxe"},
            new String[]{"SEED-MMA-ONE-001", "ONE Championship: Bangkok Showdown",
                    "2026-05-16T09:00:00", "Bangkok, Thailand", "MMA"},
            new String[]{"SEED-MMA-ONE-002", "ONE Fight Night: Singapore",
                    "2026-06-12T09:00:00", "Singapore", "MMA"}
        );

        for (String[] e : events) {
            if (!eventRepository.existsByExternalId(e[0])) {
                Event event = Event.builder()
                        .externalId(e[0])
                        .name(e[1])
                        .date(LocalDateTime.parse(e[2]))
                        .location(e[3])
                        .category(e[4])
                        .source(e[0].startsWith("SEED-MMA") ? "ESPN_MMA" : "ESPN_BOXING")
                        .build();
                eventRepository.save(event);
            }
        }
    }

    private void seedFights() {
        List<String[]> fights = List.of(
            // {externalId, fighter1, fighter2, eventName, data, local, categoria}
            new String[]{"FIGHT-SEED-001", "Islam Makhachev", "Justin Gaethje",
                    "UFC 302", "2024-06-01T23:00:00", "Newark, USA", "MMA"},
            new String[]{"FIGHT-SEED-002", "Alex Pereira", "Jiri Prochazka",
                    "UFC 303", "2024-06-29T23:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"FIGHT-SEED-003", "Jon Jones", "Stipe Miocic",
                    "UFC 309", "2024-11-16T23:00:00", "New York, USA", "MMA"},
            new String[]{"FIGHT-SEED-004", "Ilia Topuria", "Max Holloway",
                    "UFC 308", "2024-10-26T23:00:00", "Abu Dhabi, UAE", "MMA"},
            new String[]{"FIGHT-SEED-005", "Dricus Du Plessis", "Israel Adesanya",
                    "UFC 305", "2024-08-17T23:00:00", "Perth, Australia", "MMA"},
            new String[]{"FIGHT-SEED-006", "Charles Oliveira", "Arman Tsarukyan",
                    "UFC 300", "2024-04-13T23:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"FIGHT-SEED-007", "Sean O'Malley", "Merab Dvalishvili",
                    "UFC 306", "2024-09-14T23:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"FIGHT-SEED-008", "Conor McGregor", "Michael Chandler",
                    "UFC 303", "2024-06-29T23:00:00", "Las Vegas, USA", "MMA"},
            new String[]{"FIGHT-SEED-009", "Canelo Álvarez", "Edgar Berlanga",
                    "Canelo vs Berlanga", "2024-09-14T23:00:00", "Las Vegas, USA", "Boxe"},
            new String[]{"FIGHT-SEED-010", "Oleksandr Usyk", "Tyson Fury",
                    "Usyk vs Fury 2", "2024-12-21T22:00:00", "Riyadh, Saudi Arabia", "Boxe"},
            new String[]{"FIGHT-SEED-011", "Naoya Inoue", "Luis Nery",
                    "Inoue vs Nery", "2024-05-06T21:00:00", "Tokyo, Japan", "Boxe"},
            new String[]{"FIGHT-SEED-012", "Gervonta Davis", "Frank Martin",
                    "Davis vs Martin", "2024-06-15T23:00:00", "Las Vegas, USA", "Boxe"},
            new String[]{"FIGHT-SEED-013", "Gordon Ryan", "Felipe Pena",
                    "ADCC 2024", "2024-09-21T14:00:00", "Birmingham, USA", "Jiu-Jitsu"},
            new String[]{"FIGHT-SEED-014", "Nicholas Meregali", "Kaynan Duarte",
                    "ADCC 2024", "2024-09-22T14:00:00", "Birmingham, USA", "Jiu-Jitsu"},
            new String[]{"FIGHT-SEED-015", "Rodtang Jitmuangnon", "Superbon",
                    "ONE Championship", "2024-10-05T09:00:00", "Bangkok, Thailand", "Muay Thai"},
            new String[]{"FIGHT-SEED-016", "Rico Verhoeven", "Badr Hari",
                    "Glory Kickboxing 90", "2024-11-30T20:00:00", "Rotterdam, Netherlands", "Kickboxing"}
        );

        for (String[] f : fights) {
            String extId = f[0];
            if (eventRepository.existsByExternalId(extId)) continue;

            Fighter f1 = getOrCreateFighter(f[1], f[6]);
            Fighter f2 = getOrCreateFighter(f[2], f[6]);

            Event event = Event.builder()
                    .externalId(extId)
                    .name(f[3])
                    .date(LocalDateTime.parse(f[4]))
                    .location(f[5])
                    .category(f[6])
                    .source("SYNC_PAST")
                    .build();
            eventRepository.save(event);

            Fight fight = new Fight();
            fight.setFighter1(f1);
            fight.setFighter2(f2);
            fight.setEvent(event);
            fightRepository.save(fight);
        }
    }

    private Fighter getOrCreateFighter(String name, String category) {
        return fighterRepository.findByNameContainingIgnoreCase(name)
                .stream().findFirst()
                .orElseGet(() -> {
                    Fighter f = new Fighter();
                    f.setName(name);
                    f.setCategory(category);
                    return fighterRepository.save(f);
                });
    }
}
