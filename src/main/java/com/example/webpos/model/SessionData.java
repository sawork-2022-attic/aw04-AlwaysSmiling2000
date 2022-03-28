package com.example.webpos.model;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

// A simple model used to experiment with session sharing problem
@Component
@SessionScope
public class SessionData implements Serializable {

    private final List<String> messages = new ArrayList<>();

    public List<String> getMessages() {
        return messages;
    }

    public void addMessage(String message) {
        messages.add(message);
    }

}
