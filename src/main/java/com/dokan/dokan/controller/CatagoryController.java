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
//    @GetMapping("api/public/catagories")
//    public List<Catagory> getCategories() {
//        return catagoryService.getAllCategories();
//    }

    @GetMapping("/api/public/catagories")
    public ResponseEntity<List<Catagory>> getCatagories() {
        catagoryService.getAllCategories();
        return new ResponseEntity<>(catagoryService.getAllCategories(), HttpStatus.OK);
    }

    //get func
//    @GetMapping("api/public/catagories/{catagoryId}")
//    public Catagory getcatagoryById(@PathVariable("catagoryId") Long catagoryId) {
//        return catagoryService.getcatagoryById(catagoryId);
//    }

    @GetMapping("api/public/catagories/{catagoryId}")
    public ResponseEntity<Catagory> getcatagoryById(@PathVariable("catagoryId") Long catagoryId) {
        Catagory catagory = catagoryService.getcatagoryById(catagoryId);
        if (catagory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(catagoryService.getcatagoryById(catagoryId), HttpStatus.OK);
    }

    //post function
//    @PostMapping("api/public/catagories")
//    public String addcatagory(@RequestBody catagory catagory) {
//        catagoryService.createcatagory(catagory);
//        return "catagory added";
//    }

    @PostMapping("/api/public/catagories")
    public ResponseEntity<String> addcatagory(@RequestBody Catagory catagory) {
        catagoryService.createcatagory(catagory);
        return new ResponseEntity<>("catagory " + catagory.getCatagoryId() + " added", HttpStatus.CREATED);
    }

    //delete func
//    @DeleteMapping("api/public/catagories/{catagoryId}")
//    public String deletecatagory(@PathVariable Long catagoryId) {
//        return catagoryService.deletecatagory(catagoryId);
//    }

    @DeleteMapping("api/public/catagories/{catagoryId}")
    public ResponseEntity<String> deletecatagory(@PathVariable Long catagoryId) {
        Boolean status = catagoryService.deletecatagory(catagoryId);
        if (status) {
            return new ResponseEntity<>("catagory " + catagoryId + " deleted", HttpStatus.OK);
        }
        return new ResponseEntity<>("catagory not found or does not exist", HttpStatus.NOT_FOUND);
    }


}
