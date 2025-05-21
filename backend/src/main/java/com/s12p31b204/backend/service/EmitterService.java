package com.s12p31b204.backend.service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
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

    private final ConcurrentHashMap<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();


    public List<SseEmitter> getEmitter(Long userId) {
        return emitters.get(userId);
    }
    public SseEmitter addEmitter(Long userId, SseEmitter emitter) throws Exception {
        emitters.computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError((e) -> removeEmitter(userId, emitter));

        emitter.send("SSE Connection Success");
        log.info("SSE Connection Success : " + userId);

        return emitter;
    }

    public void removeEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> emitterList = emitters.get(userId);
        if(emitterList != null) {
            emitterList.remove(emitter);
        }
    }

    public <E> void sendEvent(Long userId, String eventName, E eventData) {
            List<SseEmitter> emitterList = getEmitter(userId);
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .name(eventName)
                    .data(eventData);
            for(SseEmitter emitter : emitterList) {
                try {
                    emitter.send(event);
                } catch (Exception e) {
                    emitter.complete();
                    emitterList.remove(emitter);
                    log.error("failed to send " + eventName, e);
                }
            }
            log.info("send " + eventName);
    }

    @PostConstruct
    public void sendHeartBeat() {
        log.info("Start Send HeartBeat");
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

        Runnable dropTheBeat = new Runnable() {
            @Override
            public void run() {
                for(Long userId : emitters.keySet()) {
                    List<SseEmitter> emitterList = getEmitter(userId);
                    for(SseEmitter emitter : emitterList) {
                        try {
                            emitter.send("SSE HeartBeat");
                        } catch (Exception e) {
                            log.error(e.getMessage());
                            emitter.complete();
                            emitterList.remove(emitter);
                        }
                    }
                }
            }
        };

        executor.scheduleWithFixedDelay(dropTheBeat, 0, 10, TimeUnit.SECONDS);
    }
}
