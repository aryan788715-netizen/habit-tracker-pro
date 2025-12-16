# 🎯 Habit Tracker Pro

A modern, feature-rich habit tracking web application with heavy analytics, clean UI, and comprehensive progress visualization.

## ✨ Features

### Core Functionality
- **User Authentication** - Secure login/signup system with private user data
- **Habit Management** - Create, edit, and delete habits with custom colors
- **Daily Tracking** - Quick check-off system with visual feedback
- **Streak Counter** - Track consecutive days for each habit
- **Completion Rates** - 30-day completion percentage per habit

### Dashboard
- **Weekly Overview** - Visual week grid showing completion status
- **Today's Habits** - Quick access to daily tasks
- **Overall Stats** - Total habits, longest streak, completion rate
- **Progress Tracking** - Real-time updates on daily progress

### Heavy Analytics
- **Weekly Bar Charts** - Monday-Sunday completion visualization
- **Progress Trend Lines** - Multi-week progress tracking
- **Monthly Comparison** - 6-month historical comparison
- **Habit Comparison** - Doughnut chart comparing all habits
- **GitHub-Style Heatmap** - 365-day activity calendar
- **Smart Filters** - Filter by week/month/year and specific habits

### Design & UX
- **Apple-Level Polish** - Clean, minimal, professional interface
- **Smooth Animations** - Micro-interactions and transitions
- **Responsive Design** - Mobile-first, desktop-optimized
- **Dark/Light Mode** - Theme toggle with persistent preference
- **Soft Shadows** - Subtle depth and elevation
- **Rounded Cards** - Modern card-based layout

## 🚀 Live Demo

**[View Live Website](https://aryan788715-netizen.github.io/habit-tracker-pro/)**

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Charts**: Chart.js 4.4.0
- **Storage**: LocalStorage for data persistence
- **Fonts**: Inter (Google Fonts)
- **Deployment**: GitHub Pages

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/aryan788715-netizen/habit-tracker-pro.git
cd habit-tracker-pro
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

3. Visit `http://localhost:8000` in your browser

## 💡 Usage

### Getting Started
1. **Sign Up** - Create an account with your name, email, and password
2. **Add Habits** - Click "Add Habit" and customize with name, description, and color
3. **Track Daily** - Check off habits as you complete them each day
4. **View Analytics** - Navigate to Analytics tab for detailed insights

### Features Guide

**Dashboard Tab**
- View weekly overview with completion status
- Check today's habits with one click
- Monitor overall statistics

**Habits Tab**
- Manage all your habits
- Edit habit details
- Delete habits you no longer need
- View individual habit statistics

**Analytics Tab**
- Filter by time period (week/month/year)
- Filter by specific habit or view all
- Explore multiple chart types
- Analyze long-term trends with heatmap

## 🎨 Customization

### Color Themes
The app supports 8 preset colors for habits:
- Indigo (#6366f1)
- Purple (#8b5cf6)
- Pink (#ec4899)
- Rose (#f43f5e)
- Amber (#f59e0b)
- Emerald (#10b981)
- Cyan (#06b6d4)
- Slate (#64748b)

### Theme Toggle
Switch between light and dark modes using the theme toggle button in the header.

## 📊 Data Structure

### User Data
```javascript
{
  email: "user@example.com",
  name: "John Doe",
  password: "hashed_password"
}
```

### Habit Object
```javascript
{
  id: "1234567890",
  name: "Morning Exercise",
  description: "30 minutes of cardio",
  color: "#6366f1",
  createdAt: "2025-01-01T00:00:00.000Z"
}
```

### Completions Object
```javascript
{
  "2025-01-01": {
    "habit_id_1": true,
    "habit_id_2": false
  }
}
```

## 🔒 Privacy & Security

- All data stored locally in browser's LocalStorage
- No server-side storage or external API calls
- Each user's data is isolated by email
- Passwords stored in plain text (demo purposes - use proper hashing in production)

## 🚧 Future Enhancements

- [ ] Backend integration with database
- [ ] Password hashing and proper authentication
- [ ] Social features (share progress, compete with friends)
- [ ] Habit categories and tags
- [ ] Custom habit frequencies (weekly, monthly)
- [ ] Reminders and notifications
- [ ] Export data (CSV, JSON)
- [ ] Import habits from other apps
- [ ] Advanced analytics (correlations, insights)
- [ ] Mobile app (React Native)

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Aryan**
- GitHub: [@aryan788715-netizen](https://github.com/aryan788715-netizen)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Google Fonts for Inter typeface
- Inspiration from Habitica, Streaks, and Apple's design language

---

**Built with ❤️ for better habits and productivity**