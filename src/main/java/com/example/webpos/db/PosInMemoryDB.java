package com.example.webpos.db;

import com.example.webpos.model.Item;
import com.example.webpos.model.Product;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class PosInMemoryDB implements PosDB {

    private Map<String, Product> products = new HashMap<>();

    // single cart
    private Map<String, Item> cart = new HashMap<>();

    @Override
    public List<Product> getProducts() {
        return new ArrayList<>(products.values());
    }

    @Override
    public boolean addItem(String productId, int quantity) {
        if (cart.containsKey(productId)) {
            // an existing one
            Item item = cart.get(productId);
            int prevQuan = item.getQuantity();
            if (prevQuan + quantity > 0) {
                // update quantity
                item.setQuantity(prevQuan + quantity);
            } else {
                // remove this item
                cart.remove(productId);
            }
        } else if (quantity > 0) {
            cart.put(productId, new Item(products.get(productId), quantity, System.currentTimeMillis()));
        } else {
            // add a new item with negative quantity
            return false;
        }
        return true;
    }

    @Override
    public boolean removeItem(String productId) {
        if (cart.containsKey(productId)) {
            cart.remove(productId);
            return true;
        }
        // no such item
        return false;
    }

    @Override
    public List<Item> getCart() {
        List<Item> items = new ArrayList<>(cart.values());
        // sort by timestamp
        items.sort((i1, i2) -> {
            long dts = i1.getTimestamp() - i2.getTimestamp();
            return dts < 0 ? -1 : (dts > 0 ? 1 : 0);
        });
        return items;
    }

    @Override
    public boolean emptyCart() {
        if (!cart.isEmpty()) {
            cart.clear();
            return true;
        }
        // indicates no change
        return false;
    }

    @Override
    public Product getProduct(String productId) {
        return products.getOrDefault(productId, null);
    }

    private PosInMemoryDB() {
        this.products.put("PD1", new Product("PD1", "Mac Pro", 5999, "1.jpg", "https://www.apple.com/shop/buy-mac/mac-pro"));
        this.products.put("PD2", new Product("PD2", "iPhone 13 Pro", 999, "2.jpg", "https://www.apple.com/shop/buy-iphone/iphone-13-pro"));
        this.products.put("PD3", new Product("PD3", "iPad Pro", 799, "3.jpg", "https://www.apple.com/shop/buy-ipad/ipad-pro"));
        this.products.put("PD4", new Product("PD4", "Apple Watch Hermès", 1229, "4.jpg", "https://www.apple.com/shop/buy-watch/apple-watch-hermes"));
        this.products.put("PD5", new Product("PD5", "AirPods Max", 549, "5.png", "https://www.apple.com/shop/buy-airpods/airpods-max"));
        this.products.put("PD6", new Product("PD6", "Apple TV 4K", 199, "6.jpg", "https://www.apple.com/shop/buy-tv/apple-tv-4k"));
        this.products.put("PD7", new Product("PD7", "AirTag", 29, "7.jpg", "https://www.apple.com/shop/buy-airtag/airtag"));
        this.products.put("PD8", new Product("PD8", "HomePod mini", 99, "8.jpg", "https://www.apple.com/shop/buy-homepod/homepod-mini"));
    }

}
