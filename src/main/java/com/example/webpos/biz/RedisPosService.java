package com.example.webpos.biz;

import com.example.webpos.db.PosDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

public class RedisPosService implements PosService {

    private final PosDB posDB;

    public RedisPosService(PosDB posDB) {
        this.posDB = posDB;
    }

    @Cacheable("query-result")
    @Override
    public String query(int key) {
        return posDB.findForQuery(key);
    }

}
