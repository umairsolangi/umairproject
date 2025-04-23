# 🚚 Last Mile Delivery System

An all-in-one delivery platform connecting customers with vendors (food, groceries, pharmacies, etc.) and offering courier services for parcel sending/receiving. This system enhances convenience for users while increasing earning opportunities for delivery riders.

## 📱 Features

### For Customers:
- Place orders from multiple vendors in one app
- Track order progress in real-time
- Schedule orders and deliveries
- Create daily food menus
- Send and receive parcels via the courier feature

### For Vendors:
- **In-App Vendors**: 
  - Create shops and multiple branches
  - Manage orders and suborders
  - Approval-based onboarding by Admin
- **API Vendors**: 
  - Seamless integration with the platform via APIs
  - Automatic order processing

### For Riders:
- Accept delivery or courier jobs
- Track earnings and delivery history
- Navigate using integrated maps

---

## 🧱 Tech Stack

### Frontend (Mobile App)
- React Native (React Native CLI)
- React Native Maps
- React Native Paper
- Context API for global state management
- Step Indicator for tracking order stages

### Backend
- Laravel (RESTful API)
- MySQL database

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/ImRehmankhan/Last_Mile_Delivery.git
cd last-mile-delivery

Install Mobile Dependencies
cd mobile-app
npm install
npx react-native link

cd backend
composer install
cp .env.example .env
php artisan key: generate
php artisan migrate
php artisan serve



