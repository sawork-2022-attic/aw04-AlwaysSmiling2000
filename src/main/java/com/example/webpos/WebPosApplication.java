package com.example.webpos;

import com.example.webpos.biz.PosService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class WebPosApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebPosApplication.class, args);
    }

}
