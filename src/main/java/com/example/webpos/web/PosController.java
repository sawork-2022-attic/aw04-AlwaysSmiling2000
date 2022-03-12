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

import java.net.http.HttpResponse;
import java.util.List;
import java.util.logging.Logger;

@Slf4j
@Controller
public class PosController {

    private PosService posService;

    @Autowired
    public void setPosService(PosService posService) {
        this.posService = posService;
    }

    @GetMapping("/")
    public String pos(Model model) {
        model.addAttribute("products", posService.products());
        model.addAttribute("cart", posService.getCart());
        return "index";
    }

    // add a new item to the cart or
    // change the number of an existing one
    @ResponseBody
    @PostMapping("/cart/{productId}")
    public ResponseEntity<List<Item>> add(@PathVariable("productId") String productId, @RequestParam("amount") int amount) {
        // add successfully
        if (posService.add(productId, amount)) {
            // return the new list of items, inefficient
            return ResponseEntity.ok().body(posService.getCart());
        }
        // fail for some reason
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    // remove an existing item in the cart
    @ResponseBody
    @DeleteMapping("/cart/{productId}")
    public ResponseEntity<List<Item>> remove(@PathVariable("productId") String productId) {
        // remove successfully
        if (posService.remove(productId)) {
            return ResponseEntity.ok().body(posService.getCart());
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    // empty the cart
    @ResponseBody
    @DeleteMapping("/cart")
    public ResponseEntity<List<Item>> empty() {
        if (posService.empty()) {
            return ResponseEntity.ok().body(posService.getCart());
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
