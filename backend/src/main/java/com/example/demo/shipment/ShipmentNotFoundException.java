package com.example.demo.shipment;

public class ShipmentNotFoundException extends RuntimeException {
    public ShipmentNotFoundException(Long id) {
        super("Shipment with id " + id + " was not found");
    }
}
