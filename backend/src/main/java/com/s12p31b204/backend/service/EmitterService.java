package com.s12p31b204.backend.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class EmitterService {

    private final ConcurrentHashMap<Long, SseEmitter> emitters = new ConcurrentHashMap<>();


    public SseEmitter getEmitter(Long userId) {
        return emitters.get(userId);
    }
    public SseEmitter addEmitter(Long userId, SseEmitter emitter) throws Exception {
        emitters.computeIfAbsent(userId, key -> emitter);
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        emitter.send("SSE Connection Success");
        log.info("SSE Connection Success : " + userId);

        return emitter;
    }

    public SseEmitter addEmitter(Long userId) throws Exception {
        SseEmitter emitter = emitters.get(userId);
        if(emitter != null) {
            emitter.complete();
            emitters.remove(userId);
        }
        emitter = new SseEmitter(TimeUnit.HOURS.toMillis(1));

        return addEmitter(userId, emitter);
    }

    public <E> void sendEvent(Long userId, String eventName, E eventData) {
        try {
            SseEmitter emitter = getEmitter(userId);
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .name(eventName)
                    .data(eventData);
            emitter.send(event);
            log.info("send " + eventName);
        } catch (Exception e) {
            log.error("failed to send " + eventName, e);
        }
    }

    @PostConstruct
    public void sendHeartBeat() {
        log.info("Start Send HeartBeat");
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

        Runnable dropTheBeat = new Runnable() {
            @Override
            public void run() {
                for(Long userId : emitters.keySet()) {
                    try {
                        SseEmitter emitter = emitters.get(userId);
                        if(emitter == null) {
                            emitters.remove(userId);
                        } else {
                            emitter.send("SSE HeartBeat");
                        }
                    } catch (Exception e) {
                        log.error(e.getMessage());
                        emitters.remove(userId);
                    }
                }
            }
        };

        executor.scheduleWithFixedDelay(dropTheBeat, 0, 10, TimeUnit.SECONDS);
    }
}
