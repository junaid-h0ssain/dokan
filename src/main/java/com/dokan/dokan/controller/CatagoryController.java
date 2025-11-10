package com.dokan.dokan.controller;

import com.dokan.dokan.service.CatagoryService;
import lombok.Data;
import com.dokan.dokan.model.Catagory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
public class CatagoryController {

    // catagoryservice class
    private CatagoryService catagoryService;

    //constructor
    public CatagoryController(CatagoryService catagoryService) {
        this.catagoryService = catagoryService;
    }

    //get function
    @GetMapping("api/public/catagories")
    public List<Catagory> getCategories() {
        return catagoryService.getAllCategories();
    }

    //get func
    @GetMapping("api/public/catagories/{catagoryId}")
    public Catagory getcatagoryById(@PathVariable("catagoryId") Long catagoryId) {
        return catagoryService.getcatagoryById(catagoryId);
    }

    //post function
//    @PostMapping("api/public/catagories")
//    public String addcatagory(@RequestBody catagory catagory) {
//        catagoryService.createcatagory(catagory);
//        return "catagory added";
//    }

    //delete func
    @DeleteMapping("api/public/catagories/{catagoryId}")
    public String deletecatagory(@PathVariable Long catagoryId) {
        return catagoryService.deletecatagory(catagoryId);
    }

    @PostMapping("/api/public/catagories")
    public ResponseEntity<String> addcatagory(@RequestBody Catagory catagory) {
        catagoryService.createcatagory(catagory);
        return new ResponseEntity<>("catagory " + catagory.getCatagoryId() + " added", HttpStatus.OK);
    }
}
