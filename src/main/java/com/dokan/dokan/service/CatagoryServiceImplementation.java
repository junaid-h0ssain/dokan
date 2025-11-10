package com.dokan.dokan.service;

import com.dokan.dokan.model.Catagory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CatagoryServiceImplementation implements CatagoryService {
    private final List<Catagory> categories =  new ArrayList<>();

    private Long nextId = 1000L;

    @Override
    public List<Catagory> getAllCategories() {
        return categories;
    }

    @Override
    public Catagory getcatagoryById(Long catagoryId) {
        for (Catagory catagory : categories) {
            if (catagory.getCatagoryId().equals(catagoryId)) {
                return catagory;
            }
        }
        return null;
    }

    @Override
    public Catagory getcatagoryByName(String catagoryName) {
        return null;
    }

    @Override
    public void createcatagory(Catagory catagory) {
        catagory.setCatagoryId(nextId++);
        categories.add(catagory);
    }

    @Override
    public Boolean deletecatagory(Long catagoryId) {
        Catagory catagory = getcatagoryById(catagoryId);
        if (catagory == null) {
            return false;
        }
        categories.remove(catagory);
        return true;
    }
}
