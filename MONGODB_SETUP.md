# MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Windows
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will run as a Windows service automatically
4. Default connection: `mongodb://localhost:27017/booky`

### Mac (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Option 2: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/booky?retryWrites=true&w=majority
   ```

## Verify MongoDB is Running

### Local MongoDB
```bash
# Check if MongoDB is running
mongosh
# or
mongo
```

### Test Connection
Once your backend is running, check the console. You should see:
```
✅ Connected to MongoDB: mongodb://localhost:27017/booky
```

## Troubleshooting

**Connection Refused Error:**
- Make sure MongoDB service is running
- Check if port 27017 is available
- Verify MONGODB_URI in `.env` file

**Authentication Failed:**
- Check username/password in connection string
- Verify database user has proper permissions

**Network Error (Atlas):**
- Check IP whitelist in Atlas dashboard
- Verify connection string format
