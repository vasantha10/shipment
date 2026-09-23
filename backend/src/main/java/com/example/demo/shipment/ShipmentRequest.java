package com.example.demo.shipment;

  import jakarta.validation.constraints.FutureOrPresent;
  import jakarta.validation.constraints.NotNull;
  import jakarta.validation.constraints.Size;
  import java.time.LocalDate;

  public class ShipmentRequest {

      @NotNull
      @Size(min = 5, max = 30)
      private String trackingNumber;

      @NotNull
      @Size(min = 2, max = 100)
      private String senderName;

      @NotNull
      @Size(min = 2, max = 100)
      private String receiverName;

      @NotNull
      @Size(min = 2, max = 100)
      private String origin;

      @NotNull
      @Size(min = 2, max = 100)
      private String destination;

      @NotNull
      @Size(min = 2, max = 100)
      private String carrier;

      // Optional: defaults to CREATED in the service layer if null
      private ShipmentStatus status;

      @NotNull
      @FutureOrPresent(message = "expectedDeliveryDate must not be in the past")
      private LocalDate expectedDeliveryDate;

      // Getters and setters

      public String getTrackingNumber() { return trackingNumber; }
      public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

      public String getSenderName() { return senderName; }
      public void setSenderName(String senderName) { this.senderName = senderName; }

      public String getReceiverName() { return receiverName; }
      public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

      public String getOrigin() { return origin; }
      public void setOrigin(String origin) { this.origin = origin; }

      public String getDestination() { return destination; }
      public void setDestination(String destination) { this.destination = destination; }

      public String getCarrier() { return carrier; }
      public void setCarrier(String carrier) { this.carrier = carrier; }

      public ShipmentStatus getStatus() { return status; }
      public void setStatus(ShipmentStatus status) { this.status = status; }

      public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
      public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
  }
