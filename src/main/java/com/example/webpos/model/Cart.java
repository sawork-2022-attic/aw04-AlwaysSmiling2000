package com.example.webpos.model;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@SessionScope
public class Cart implements Serializable {

    private final Map<String, Item> items = new ConcurrentHashMap<>();

    public List<Item> getItems() {
        return new ArrayList<>(items.values());
    }

    public boolean addProduct(Product product, int quantity) {
        // sanity check
        if (product == null) {
            return false;
        }
        String productId = product.getId();
        if (productId == null) {
            return false;
        }

        // check quantity
        if (items.containsKey(productId)) {
            Item item = items.get(productId);
            int q = item.getQuantity();
            if (q + quantity < 0) {
                return false;
            } else if (q + quantity > 0) {
                item.setQuantity(q + quantity);
            } else {
                items.remove(productId);
            }
            return true;
        } else if (quantity > 0) {
            items.put(productId, new Item(product, quantity, System.currentTimeMillis()));
            return true;
        }
        return false;
    }

    public boolean removeProduct(String productId) {
        if (items.containsKey(productId)) {
            items.remove(productId);
            return true;
        }
        return false;
    }

    public boolean removeAll() {
        items.clear();
        return true;
    }
}
