package com.example.webpos.db;

import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

// JD sometimes requires us to log in before search. This will lead to
// an internal server error, so we'll use a fake DB implementation to
// experiment with scalable web applications.
@Repository
public class FakePosDB implements PosDB {

    @Override
    public String findForQuery(int key) {
        // simulate querying the DBMS
        try {
            TimeUnit.MILLISECONDS.sleep(key * 200L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "This is the query result for: " + key;
    }

}
