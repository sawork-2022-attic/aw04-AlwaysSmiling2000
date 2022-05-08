package com.example.webpos.web;

import com.example.webpos.biz.PosService;
import com.example.webpos.model.Item;
import com.example.webpos.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
public class PosController {

    @Autowired
    private PosService posService;

    @GetMapping("/")
    public String pos(Model model) {
        model.addAttribute("products", posService.products());
        model.addAttribute("cart", posService.cartItems());
        model.addAttribute("order", posService.getOrder());
        return "index";
    }

    // add a new item to the cart or
    // change the number of an existing one
    @ResponseBody
    @PostMapping("/cart/{productId}")
    public ResponseEntity<Void> add(
            @PathVariable("productId") String productId,
            @RequestParam("quantity") int quantity
    ) {
        // add successfully
        if (posService.add(productId, quantity)) {
            // return the new list of items, inefficient
            return ResponseEntity.ok().build();
        }
        // fail for some reason
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // remove an existing item in the cart
    @ResponseBody
    @DeleteMapping("/cart/{productId}")
    public ResponseEntity<Void> remove(@PathVariable("productId") String productId) {
        // remove successfully
        if (posService.remove(productId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @ResponseBody
    @GetMapping("/cart")
    public ResponseEntity<List<Item>> getCart() {
        return ResponseEntity.ok().body(posService.cartItems());
    }

    // empty the cart
    @ResponseBody
    @DeleteMapping("/cart")
    public ResponseEntity<Void> empty() {
        if (posService.empty()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    // checkout all items in the cart
    @ResponseBody
    @PostMapping("/order")
    public ResponseEntity<Order> checkout() {
        // no further request sent here, just get the cost info
        Order order = posService.checkout();
        if (order != null) {
            return ResponseEntity.ok().body(order);
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    // compute the order info, part of which could be put into
    // the frontend, so it's not so efficient
    @ResponseBody
    @GetMapping("/order")
    public ResponseEntity<Order> getOrder() {
        return ResponseEntity.ok().body(posService.getOrder());
    }
}
