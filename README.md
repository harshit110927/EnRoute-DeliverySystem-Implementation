EnRoute Delivery – Smart Last-Mile Optimization
Overview

EnRoute Delivery is an innovative delivery model designed to optimize last-mile logistics by allowing customers to pick up orders from chokepoints along their daily routes instead of doorstep delivery. This reduces delivery miles, fuel consumption, and emissions while improving delivery efficiency and scalability for retailers.

The project is integrated into a Walmart frontend clone and provides an end-to-end experience: from order checkout → location input → chokepoint detection → slot assignment → order confirmation.

Features

Address & Location Input

Manual input, auto-detect (geolocation), or map pin drop.

Zone Detection

User’s location is mapped to predefined delivery zones.

Chokepoint Selection

Nearby chokepoints displayed on an interactive map.

Different marker colors for user location and chokepoints.

Inline map UI inside checkout with optional full-page view.

Slot Assignment & Load Balancing

Backend API assigns time slots.

Smart crowd load balancing with fallback chokepoints.

User gets one free reschedule option.

Checkout Integration

Works seamlessly within the Walmart frontend clone.

Technical Stack

Frontend: React + TypeScript + Vite + TailwindCSS

Backend APIs: Node.js + Express

Mapping: Leaflet.js + OpenStreetMap

Database: MongoDB

Deployment: Docker-based local setup

Impact (South Dallas Case Study)

Households: ~500,000

Online Orders/Week: ~100,000

Avg. Order Value: $85

Avg. Delivery Distance: 5 miles

Fuel Consumption: 0.15 gallons/mile

Key Savings with 10% EnRoute Adoption

Miles Saved: ~50,000 miles/week

Fuel Saved: ~7,500 gallons/week

Cost Savings: ~15% reduction in last-mile delivery cost

Emissions Reduction: ~67 metric tons CO₂/week

How It Works

Customer enters location during checkout.

System assigns delivery zone.

Nearby chokepoints are displayed on the map.

Customer selects preferred chokepoint.

Backend assigns delivery slot considering load balancing.

Confirmation screen shows final chokepoint + time slot.

Future Enhancements

Dynamic route optimization for delivery vans.

ML-based demand prediction for chokepoint capacity.

Incentive mechanism for customers choosing EnRoute delivery.

