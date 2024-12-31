# File Share Application

A secure file-sharing web application where users can upload, encrypt, and share files with others. The application ensures client-side encryption for security and provides authentication with two user roles: `Guest` and `Normal`. Users can also share files with specified expiry dates.

## Features

- **Client-Side Encryption**: Files are encrypted in the browser before being uploaded to the server, ensuring maximum security.
- **Authentication**: 
  - Guests: Limited access for temporary or unregistered users.
  - Normal Users: Full access with additional features.
- **File Sharing**: Users can share files with other users with an optional expiry date.
- **File Expiry**: File owners can set expiry of access.
- **User Roles**: 
  - Guests: Only File View Capability.
  - Normal Users: Enhanced features, including managing files and sharing settings.

## Technologies Used

### Frontend
- **Framework/Library**: [React.js/Redux/Shadcn]
- **Encryption**: [Web Crypto API]

### Backend
- **Framework**: [Django/Python]
- **Database**: [Sqlite]
- **Authentication**: [JWT Session Cookie based]


## Setup Instructions

### Installation

#### Clone the Repository
```bash
git clone https://github.com/himanu/file_share.git
cd file_share

docker-compose up --build
