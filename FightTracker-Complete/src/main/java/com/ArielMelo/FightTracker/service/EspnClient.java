package com.ArielMelo.FightTracker.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

/**
 * Busca eventos da TheSportsDB.
 * IDs verificados:
 *   4407 = UFC/MMA ✓
 *   4443 = ONE Championship
 *   4480 = Boxing
 */
@Slf4j
@Component
public class EspnClient {

    private static final String BASE = "https://www.thesportsdb.com/api/v1/json/3";

    // IDs verificados na TheSportsDB
    private static final String UFC_NEXT    = BASE + "/eventsnextleague.php?id=4407";
    private static final String UFC_PAST    = BASE + "/eventspastleague.php?id=4407";
    private static final String ONE_NEXT    = BASE + "/eventsnextleague.php?id=4443";
    private static final String ONE_PAST    = BASE + "/eventspastleague.php?id=4443";
    private static final String BOX_NEXT    = BASE + "/eventsnextleague.php?id=4480";
    private static final String BOX_PAST    = BASE + "/eventspastleague.php?id=4480";

    private final WebClient client = WebClient.builder()
            .defaultHeader("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
            .defaultHeader("Accept", "application/json")
            .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
            .build();

    public List<EspnEvent> fetchMmaEvents()        { return fetch(UFC_NEXT, "UFC próximos"); }
    public List<EspnEvent> fetchMmaPastEvents()    { return fetch(UFC_PAST, "UFC passados"); }
    public List<EspnEvent> fetchBoxingEvents()     { return fetch(BOX_NEXT, "Boxing próximos"); }
    public List<EspnEvent> fetchBoxingPastEvents() { return fetch(BOX_PAST, "Boxing passados"); }
    public List<EspnEvent> fetchOneEvents()        { return fetch(ONE_NEXT, "ONE próximos"); }
    public List<EspnEvent> fetchOnePastEvents()    { return fetch(ONE_PAST, "ONE passados"); }

    private List<EspnEvent> fetch(String url, String label) {
        try {
            SportsDbResponse resp = client.get().uri(url)
                    .retrieve()
                    .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(),
                            r -> r.bodyToMono(String.class)
                                  .flatMap(body -> Mono.error(new RuntimeException(
                                          "HTTP " + r.statusCode() + ": " + body.substring(0, Math.min(200, body.length()))))))
                    .bodyToMono(SportsDbResponse.class)
                    .timeout(Duration.ofSeconds(12))
                    .block();

            if (resp == null || resp.events() == null || resp.events().isEmpty()) {
                log.info("TheSportsDB {} → 0 eventos", label);
                return Collections.emptyList();
            }

            // Filter out non-fighting sports (safety check)
            List<SportsDbEvent> filtered = resp.events().stream()
                    .filter(e -> isValidFightEvent(e))
                    .toList();

            List<EspnEvent> result = filtered.stream().map(this::convert).toList();
            log.info("TheSportsDB {} → {} eventos", label, result.size());
            return result;

        } catch (Exception e) {
            log.warn("TheSportsDB {} falhou: {}", label, e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Filtra eventos que sejam realmente de artes marciais.
     * Rejeita eventos de baseball, futebol, etc que possam vir por ID errado.
     */
    private boolean isValidFightEvent(SportsDbEvent e) {
        if (e.strSport() != null) {
            String sport = e.strSport().toLowerCase();
            if (sport.contains("baseball") || sport.contains("football") ||
                sport.contains("basketball") || sport.contains("soccer") ||
                sport.contains("tennis") || sport.contains("hockey") ||
                sport.contains("golf") || sport.contains("cricket")) {
                log.warn("Rejeitando evento de esporte inválido [{}]: {}", e.strSport(), e.strEvent());
                return false;
            }
        }
        return true;
    }

    private EspnEvent convert(SportsDbEvent e) {
        String iso = e.dateEvent() != null
                ? e.dateEvent() + "T" + (e.strTime() != null ? e.strTime() : "12:00:00") + "Z"
                : null;
        EspnAddress  addr  = new EspnAddress(e.strCity(), e.strCountry());
        EspnVenue    venue = new EspnVenue(e.strVenue(), addr);
        EspnCompetition c  = new EspnCompetition(venue);
        return new EspnEvent(e.idEvent(), e.strEvent(), e.strEvent(), iso,
                e.strHomeTeam(), e.strAwayTeam(), List.of(c));
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SportsDbResponse(@JsonProperty("events") List<SportsDbEvent> events) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SportsDbEvent(
            @JsonProperty("idEvent")     String idEvent,
            @JsonProperty("strEvent")    String strEvent,
            @JsonProperty("strSport")    String strSport,
            @JsonProperty("strHomeTeam") String strHomeTeam,
            @JsonProperty("strAwayTeam") String strAwayTeam,
            @JsonProperty("dateEvent")   String dateEvent,
            @JsonProperty("strTime")     String strTime,
            @JsonProperty("strVenue")    String strVenue,
            @JsonProperty("strCity")     String strCity,
            @JsonProperty("strCountry")  String strCountry) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record EspnScoreboard(@JsonProperty("events") List<EspnEvent> events) {}

    public record EspnEvent(String id, String name, String shortName, String date,
                            String fighter1, String fighter2,
                            List<EspnCompetition> competitions) {}
    public record EspnCompetition(EspnVenue venue) {}
    public record EspnVenue(String fullName, EspnAddress address) {}
    public record EspnAddress(String city, String country) {}
}
