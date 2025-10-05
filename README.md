# Concert Ticket Booking System

A full-stack application for managing concert ticket reservations built with Next.js (frontend) and NestJS (backend).

## 🎯 Project Overview

This project demonstrates a complete concert ticket booking system with separate admin and user interfaces. The system allows administrators to manage concerts and view reservation statistics, while users can browse concerts and make reservations.

## 🏗️ Architecture

### Frontend (Next.js)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React hooks and local state
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Client-side validation and API error handling

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **API**: RESTful endpoints
- **Validation**: Class-validator for request validation
- **Testing**: Jest with comprehensive unit tests

## 🚀 Features

### Admin Capabilities

- **Dashboard**: View statistics (total seats, reserved, cancelled)
- **Concert Management**: Create and delete concerts
- **History**: View all user reservations and cancellations
- **Real-time Updates**: Live statistics and concert list updates

### User Capabilities

- **Browse Concerts**: View all available concerts
- **Reserve Tickets**: Book one seat per concert
- **Cancel Reservations**: Cancel existing reservations
- **Reservation Status**: See which concerts are reserved/cancelled

## 📦 Project Structure

```
ticket-concert/
├── concert-api/          # Backend (NestJS)
│   ├── src/
│   │   ├── concerts/     # Concert module
│   │   ├── reservations/ # Reservation module
│   │   └── prisma/       # Database schema
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── README.md
├── concert-frontend/     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # Reusable components
│   │   └── utils/        # Utility functions
│   └── README.md
└── README.md             # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd concert-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### Frontend Setup

```bash
cd concert-frontend
npm install
npm run dev
```

### Access the Application

- **Landing Page**: http://localhost:3000/landing
- **User Portal**: http://localhost:3000/
- **Admin Portal**: http://localhost:3000/admin
- **API**: http://localhost:3001

## 🧪 Running Tests

### Backend Tests

```bash
cd concert-api
npm run test
npm run test:e2e
```

### Frontend Tests

```bash
cd concert-frontend
npm run test
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px (sidebar hidden, mobile header)
- **Tablet**: 768px - 1024px (2-column stats grid)
- **Desktop**: > 1024px (3-column stats grid, full sidebar)

## 🔧 API Endpoints

### Admin Endpoints

- `GET /admin/concerts` - List all concerts
- `POST /admin/concerts` - Create concert
- `DELETE /admin/concerts/:id` - Delete concert
- `GET /admin/concerts/stats` - Get statistics

### User Endpoints

- `GET /admin/concerts` - List concerts (same as admin)
- `POST /reservations` - Reserve ticket
- `POST /reservations/cancel` - Cancel reservation
- `GET /reservations` - List reservations

## 🎨 Design System

### Color Palette

- **Primary Blue**: #1f8ac0 (Total seats)
- **Success Green**: #13a581 (Reserved)
- **Error Red**: #e4504d (Cancelled)
- **Neutral Gray**: #e5e7eb

### Components

- **Layout**: Responsive sidebar with mobile header
- **Cards**: Concert cards with actions
- **Forms**: Validated input forms
- **Tables**: Responsive data tables
- **Notifications**: Toast notifications

## 🚀 Performance Optimizations

### Frontend

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Lazy Loading**: Dynamic imports for components

### Backend

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Prisma connection management
- **Caching**: Response caching for statistics
- **Validation**: Early request validation

## 🔒 Security Considerations

- **Input Validation**: Client and server-side validation
- **SQL Injection**: Protected by Prisma ORM
- **XSS Prevention**: React's built-in protection
- **CORS**: Configured for development

## 📈 Scalability Recommendations

### Database

- **Indexing**: Add indexes on frequently queried fields
- **Connection Pooling**: Implement connection pooling
- **Read Replicas**: Use read replicas for statistics

### Caching

- **Redis**: Implement Redis for session management
- **CDN**: Use CDN for static assets
- **Database Caching**: Cache frequently accessed data

### Load Balancing

- **Horizontal Scaling**: Multiple server instances
- **Load Balancer**: Distribute traffic evenly
- **Database Sharding**: Partition data by region

## 🎫 Concurrency Handling

### Ticket Reservation

- **Database Transactions**: Atomic operations
- **Unique Constraints**: Prevent duplicate reservations
- **Seat Availability**: Real-time seat checking
- **Queue System**: Implement reservation queue

### Recommendations

- **Redis Queues**: Use Redis for reservation queues
- **WebSockets**: Real-time seat updates
- **Rate Limiting**: Prevent spam requests
- **Reservation Timeout**: Auto-cancel expired reservations

## 📝 Development Notes

### Code Structure

```
concert-frontend/
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # Reusable components
│   └── utils/         # Utility functions

concert-api/
├── src/
│   ├── concerts/      # Concert module
│   ├── reservations/ # Reservation module
│   └── prisma/       # Database schema
```

### Best Practices

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation

## 🧪 Testing Strategy

### Backend Tests

- **Unit Tests**: Service layer with 100% coverage
- **Integration Tests**: API endpoints
- **E2E Tests**: Full application flow

### Frontend Tests

- **Component Tests**: React component testing
- **Integration Tests**: API integration
- **E2E Tests**: User workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- **Authentication**: User authentication system
- **Payment Integration**: Payment processing
- **Email Notifications**: Reservation confirmations
- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native application
- **Analytics**: Usage analytics and reporting
