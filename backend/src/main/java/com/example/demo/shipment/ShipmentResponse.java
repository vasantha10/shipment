package com.example.demo.shipment;

  import java.time.LocalDate;
  import java.time.LocalDateTime;

  public class ShipmentResponse {

      private Long id;
      private String trackingNumber;
      private String senderName;
      private String receiverName;
      private String origin;
      private String destination;
      private String carrier;
      private ShipmentStatus status;
      private LocalDate expectedDeliveryDate;
      private LocalDateTime createdAt;
      private LocalDateTime updatedAt;

      public Long getId() { return id; }
      public void setId(Long id) { this.id = id; }

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

      public LocalDateTime getCreatedAt() { return createdAt; }
      public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

      public LocalDateTime getUpdatedAt() { return updatedAt; }
      public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
  }
