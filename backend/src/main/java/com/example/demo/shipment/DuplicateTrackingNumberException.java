  package com.example.demo.shipment;

  public class DuplicateTrackingNumberException extends RuntimeException {
      public DuplicateTrackingNumberException(String trackingNumber) {
          super("A shipment with tracking number " + trackingNumber + " already exists");
      }
  }
