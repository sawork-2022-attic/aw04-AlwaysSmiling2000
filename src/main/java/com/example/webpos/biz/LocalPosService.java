package com.example.webpos.biz;

import com.example.webpos.db.PosDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

// service implementation using a local cache
public class LocalPosService implements PosService {

    private final PosDB posDB;

    private final Map<Integer, Object> localCache = new HashMap<>();

    public LocalPosService(PosDB posDB) {
        this.posDB = posDB;
    }

    @Override
    public String query(int key) {
        // check invalid key
        if (key <= 0 || key > 10) {
            return "invalid key";
        }

        Object o = localCache.getOrDefault(key, null);
        if (o == null) {
            // cache missing, query DB
            o = posDB.findForQuery(key);
            // put into local cache
            localCache.put(key, o);
        }

        return (String) o;
    }

}
