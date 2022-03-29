package com.example.webpos.web;

import com.example.webpos.biz.PosService;
import com.example.webpos.model.SessionData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.Banner;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletRegistration;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

// For convenience, we'll use a simple html template here and focus on exposing the APIs
// related to data caching and session sharing.
@Controller
public class PosController {

    private PosService posService;

    private SessionData sessionData;

    @Autowired
    public void setPosService(PosService posService) {
        this.posService = posService;
    }

    @Autowired
    public void setSessionData(SessionData sessionData) {
        this.sessionData = sessionData;
    }

    @GetMapping("/")
    public String getMessages(Model model) {
        model.addAttribute("messages", sessionData.getMessages());
        return "index";
    }

    // use @RequestParam and Map to get url-encoded data
    @PostMapping("/")
    public String addMessage(@RequestParam(value = "message", required = false) String message) {
        if (message != null && !message.isBlank()) {
            // does have a message
            sessionData.addMessage(message);
        }
        return "redirect:/";
    }

    @DeleteMapping("/")
    public String removeMessage(@RequestParam("msgIdx") int msgIdx) {
        if (msgIdx >= 0) {
            sessionData.removeMessage(msgIdx);
        } else if (msgIdx == -1) {
            sessionData.removeAllMessages();
        }
        return "redirect:/";
    }

    @ResponseBody
    @GetMapping("/query")
    public String getQueryOne(@RequestParam("key") int key) {
        return posService.query(key);
    }

}
