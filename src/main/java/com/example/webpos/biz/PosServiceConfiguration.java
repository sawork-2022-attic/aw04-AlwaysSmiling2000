package com.example.webpos.biz;

import com.example.webpos.db.PosDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties("pos.service")
@Configuration
public class PosServiceConfiguration {

    @Autowired
    private PosDB posDB;

    private String cacheType = "";

    public String getCacheType() {
        return cacheType;
    }

    public void setCacheType(String cacheType) {
        this.cacheType = cacheType;
    }

    @Bean
    public PosService posService() throws InstantiationException {
        if (cacheType.equalsIgnoreCase("local")) {
            return new LocalPosService(posDB);
        } else if (cacheType.equalsIgnoreCase("redis")) {
            return new RedisPosService(posDB);
        }
        throw new InstantiationException("No target service class found for cacheType: " + cacheType);
    }

}
