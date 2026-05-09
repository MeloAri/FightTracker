package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.entity.Event;
import com.ArielMelo.FightTracker.entity.Fight;
import com.ArielMelo.FightTracker.entity.Fighter;
import com.ArielMelo.FightTracker.repository.EventRepository;
import com.ArielMelo.FightTracker.repository.FightRepository;
import com.ArielMelo.FightTracker.repository.FighterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventSyncService {

    private final EspnClient        espnClient;
    private final EventRepository   eventRepository;
    private final FightRepository   fightRepository;
    private final FighterRepository fighterRepository;

    @Scheduled(initialDelay = 20_000, fixedRate = 6 * 60 * 60 * 1_000)
    @Transactional
    public void syncAll() {
        log.info("▶ Iniciando sync TheSportsDB...");

        int mmaEvt  = syncUpcoming(espnClient.fetchMmaEvents(),    "MMA",  "ESPN_MMA");
        int boxEvt  = syncUpcoming(espnClient.fetchBoxingEvents(), "Boxe", "ESPN_BOXING");
        int oneEvt  = syncUpcoming(espnClient.fetchOneEvents(),    "MMA",  "ESPN_MMA");

        int mmaFght = syncPast(espnClient.fetchMmaPastEvents(),    "MMA");
        int boxFght = syncPast(espnClient.fetchBoxingPastEvents(), "Boxe");
        int oneFght = syncPast(espnClient.fetchOnePastEvents(),    "MMA");

        log.info("✅ Sync — Eventos: MMA+ONE={} Boxe={} | Lutas: MMA+ONE={} Boxe={}",
                mmaEvt + oneEvt, boxEvt, mmaFght + oneFght, boxFght);
    }

    private int syncUpcoming(List<EspnClient.EspnEvent> items, String category, String source) {
        int count = 0;
        for (EspnClient.EspnEvent ev : items) {
            String extId = source + "-EVT-" + ev.id();
            if (eventRepository.existsByExternalId(extId)) continue;
            LocalDateTime date = parseDate(ev.date());
            if (date == null) date = LocalDateTime.now().plusMonths(1);
            log.info("Novo evento [{}]: {} em {}", category, ev.name(), date.toLocalDate());
            eventRepository.save(Event.builder()
                    .externalId(extId)
                    .name(ev.name() != null ? ev.name() : ev.shortName())
                    .date(date).location(buildLocation(ev))
                    .category(category).source(source).build());
            count++;
        }
        return count;
    }

    private int syncPast(List<EspnClient.EspnEvent> items, String category) {
        int count = 0;
        for (EspnClient.EspnEvent ev : items) {
            String extId = "FIGHT-" + category.toUpperCase() + "-" + ev.id();
            if (eventRepository.existsByExternalId(extId)) continue;
            LocalDateTime date = parseDate(ev.date());
            if (date == null) date = LocalDateTime.now().minusMonths(1);
            String f1 = ev.fighter1() != null && !ev.fighter1().isBlank() ? ev.fighter1() : "Atleta A";
            String f2 = ev.fighter2() != null && !ev.fighter2().isBlank() ? ev.fighter2() : "Atleta B";
            log.info("Nova luta [{}]: {} vs {} em {}", category, f1, f2, date.toLocalDate());
            Fighter fighter1 = getOrCreate(f1, category);
            Fighter fighter2 = getOrCreate(f2, category);
            Event event = Event.builder()
                    .externalId(extId)
                    .name(ev.name() != null ? ev.name() : ev.shortName())
                    .date(date).location(buildLocation(ev))
                    .category(category).source("SYNC_PAST").build();
            eventRepository.save(event);
            Fight fight = new Fight();
            fight.setFighter1(fighter1); fight.setFighter2(fighter2); fight.setEvent(event);
            fightRepository.save(fight);
            count++;
        }
        return count;
    }

    private Fighter getOrCreate(String name, String category) {
        return fighterRepository.findByNameContainingIgnoreCase(name)
                .stream().findFirst().orElseGet(() -> {
                    Fighter f = new Fighter(); f.setName(name); f.setCategory(category);
                    return fighterRepository.save(f);
                });
    }

    private LocalDateTime parseDate(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            if (raw.contains("T")) {
                String clean = raw.endsWith("Z") ? raw.substring(0, raw.length() - 1) : raw;
                return LocalDateTime.parse(clean, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }
            return LocalDate.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE).atTime(LocalTime.NOON);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private String buildLocation(EspnClient.EspnEvent ev) {
        if (ev.competitions() == null || ev.competitions().isEmpty()) return "Local a confirmar";
        EspnClient.EspnVenue v = ev.competitions().get(0).venue();
        if (v == null) return "Local a confirmar";
        StringBuilder sb = new StringBuilder();
        if (v.fullName() != null) sb.append(v.fullName()).append(", ");
        if (v.address() != null) {
            if (v.address().city()    != null) sb.append(v.address().city()).append(", ");
            if (v.address().country() != null) sb.append(v.address().country());
        }
        String r = sb.toString().replaceAll(",\\s*$", "").trim();
        return r.isBlank() ? "Local a confirmar" : r;
    }
}
