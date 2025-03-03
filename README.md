# fitchck 👕
A digital wardrobe to organize your clothing, generate the best outfits, and share your fits with the community!

## 📌 Project Overview 

### 🎯 Inspiration
Many people struggle with organizing their wardrobe or deciding what to wear. That's where fitchck comes in! Keeping track of your clothes can be a hassle, especially if you're a messy person.

With fitchck, you can:

- ✔️ Snap a picture and add it to your digital wardrobe. 
- ✔️ Get AI-generated outfit recommendations based on your clothes.
- ✔️ Share your best fits with the community on the feeds page!

### 🚀 Core Features
- Digital Wardrobe: Easily add and manage your clothing items.
- Outfit Generator: Get AI-powered outfit recommendations tailored to your wardrobe.
- Community Feeds: Share your outfits and explore what others are wearing.

### 🛠️ Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React
- APIs:
   - Google Gemini API
   - Google Maps API 
   - OpenWeather API 

## Prerequisites
- Node.js 
- npm (included with Node.js)
- git

## Setup
### 1. Clone the Repository
```bash
git clone https://github.com/dwu006/fashionapp.git  
cd fashionapp
```

### 2. Install Dependencies
```bash
npm instal
```

### 3. Create Environment Variables
- Create an .env file
- Add these environment variables
```bash
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY= your_weather_key
```

### 4. Start the Frontend
```bash 
npm run dev  
```

### 5. Start the Backend
Split the terminal or open a new one
```bash
cd backend
node app.js
```
Visit https://localhost:5173 in your browser
App is now ready to use!


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
   
Please let us know in issues if theres any problems!
Enjoy!
