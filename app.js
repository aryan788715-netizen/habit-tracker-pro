// Data Storage
let currentUser = null;
let habits = [];
let completions = {};
let currentWeek = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initializeColorPicker();
    checkAuth();
    updateCurrentDate();
});

// Auth Functions
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showMainScreen();
    } else {
        showAuthScreen();
    }
}

function showAuthScreen() {
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('main-screen').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    loadUserData();
    renderDashboard();
}

function showLogin() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('signup-form').classList.remove('active');
}

function showSignup() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
}

function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
    
    if (user && user.password === password) {
        currentUser = { email, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainScreen();
    } else {
        alert('Invalid credentials');
    }
}

function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email]) {
        alert('Email already registered');
        return;
    }
    
    users[email] = { name, password };
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainScreen();
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    habits = [];
    completions = {};
    showAuthScreen();
}

// Data Management
function loadUserData() {
    if (!currentUser) return;
    
    const userKey = `habits_${currentUser.email}`;
    const completionsKey = `completions_${currentUser.email}`;
    
    habits = JSON.parse(localStorage.getItem(userKey) || '[]');
    completions = JSON.parse(localStorage.getItem(completionsKey) || '{}');
}

function saveUserData() {
    if (!currentUser) return;
    
    const userKey = `habits_${currentUser.email}`;
    const completionsKey = `completions_${currentUser.email}`;
    
    localStorage.setItem(userKey, JSON.stringify(habits));
    localStorage.setItem(completionsKey, JSON.stringify(completions));
}

function loadFromStorage() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

// Theme Toggle
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// Navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'analytics') {
        updateAnalytics();
    } else if (tabName === 'habits') {
        renderAllHabits();
    } else if (tabName === 'dashboard') {
        renderDashboard();
    }
}

// Date Utilities
function updateCurrentDate() {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
}

function getDateKey(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function getWeekDates(weekOffset = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    
    return dates;
}

// Habit Modal
function showAddHabitModal() {
    document.getElementById('modal-title').textContent = 'Add New Habit';
    document.getElementById('edit-habit-id').value = '';
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-description').value = '';
    document.getElementById('habit-color').value = '#6366f1';
    
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === '#6366f1') {
            btn.classList.add('selected');
        }
    });
    
    document.getElementById('habit-modal').classList.add('active');
}

function showEditHabitModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    document.getElementById('modal-title').textContent = 'Edit Habit';
    document.getElementById('edit-habit-id').value = habitId;
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-description').value = habit.description || '';
    document.getElementById('habit-color').value = habit.color;
    
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === habit.color) {
            btn.classList.add('selected');
        }
    });
    
    document.getElementById('habit-modal').classList.add('active');
}

function closeHabitModal() {
    document.getElementById('habit-modal').classList.remove('active');
}

function initializeColorPicker() {
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('habit-color').value = btn.dataset.color;
        });
    });
}

function saveHabit() {
    const name = document.getElementById('habit-name').value.trim();
    const description = document.getElementById('habit-description').value.trim();
    const color = document.getElementById('habit-color').value;
    const editId = document.getElementById('edit-habit-id').value;
    
    if (!name) {
        alert('Please enter a habit name');
        return;
    }
    
    if (editId) {
        const habit = habits.find(h => h.id === editId);
        if (habit) {
            habit.name = name;
            habit.description = description;
            habit.color = color;
        }
    } else {
        const newHabit = {
            id: Date.now().toString(),
            name,
            description,
            color,
            createdAt: new Date().toISOString()
        };
        habits.push(newHabit);
    }
    
    saveUserData();
    closeHabitModal();
    renderDashboard();
    renderAllHabits();
}

function deleteHabit(habitId) {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    
    habits = habits.filter(h => h.id !== habitId);
    
    Object.keys(completions).forEach(date => {
        delete completions[date][habitId];
    });
    
    saveUserData();
    renderDashboard();
    renderAllHabits();
}

// Completion Management
function toggleCompletion(habitId, date = null) {
    const dateKey = date || getDateKey();
    
    if (!completions[dateKey]) {
        completions[dateKey] = {};
    }
    
    completions[dateKey][habitId] = !completions[dateKey][habitId];
    
    saveUserData();
    renderDashboard();
    
    const checkbox = document.querySelector(`[data-habit="${habitId}"][data-date="${dateKey}"]`);
    if (checkbox) {
        checkbox.classList.toggle('checked', completions[dateKey][habitId]);
    }
}

function isCompleted(habitId, date) {
    const dateKey = typeof date === 'string' ? date : getDateKey(date);
    return completions[dateKey]?.[habitId] || false;
}

function getStreak(habitId) {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        if (isCompleted(habitId, date)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    return streak;
}

function getCompletionRate(habitId, days = 30) {
    let completed = 0;
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        if (isCompleted(habitId, date)) {
            completed++;
        }
    }
    
    return Math.round((completed / days) * 100);
}

// Dashboard Rendering
function renderDashboard() {
    renderWeekOverview();
    renderStats();
    renderTodayHabits();
}

function renderWeekOverview() {
    const dates = getWeekDates(currentWeek);
    const weekGrid = document.getElementById('week-grid');
    
    const weekNumber = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000) + 1 + currentWeek;
    document.getElementById('week-label').textContent = `Week ${weekNumber}`;
    
    weekGrid.innerHTML = dates.map(date => {
        const dateKey = getDateKey(date);
        const dayCompletions = completions[dateKey] || {};
        const totalHabits = habits.length;
        const completedCount = Object.values(dayCompletions).filter(Boolean).length;
        
        let className = 'week-day';
        if (completedCount === totalHabits && totalHabits > 0) {
            className += ' completed';
        } else if (completedCount > 0) {
            className += ' partial';
        } else if (date < new Date() && totalHabits > 0) {
            className += ' missed';
        }
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return `
            <div class="${className}">
                <div class="week-day-name">${dayNames[date.getDay()]}</div>
                <div class="week-day-date">${date.getDate()}</div>
                <div class="week-day-count">${completedCount}/${totalHabits}</div>
            </div>
        `;
    }).join('');
}

function changeWeek(offset) {
    currentWeek += offset;
    renderWeekOverview();
}

function renderStats() {
    const totalHabits = habits.length;
    const longestStreak = habits.reduce((max, habit) => Math.max(max, getStreak(habit.id)), 0);
    
    const today = getDateKey();
    const todayCompletions = completions[today] || {};
    const todayCompleted = Object.values(todayCompletions).filter(Boolean).length;
    
    let totalCompletions = 0;
    let totalPossible = 0;
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = getDateKey(date);
        const dayCompletions = completions[dateKey] || {};
        
        totalCompletions += Object.values(dayCompletions).filter(Boolean).length;
        totalPossible += habits.length;
    }
    
    const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
    
    document.getElementById('total-habits').textContent = totalHabits;
    document.getElementById('longest-streak').textContent = longestStreak;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    document.getElementById('today-progress').textContent = `${todayCompleted}/${totalHabits}`;
}

function renderTodayHabits() {
    const container = document.getElementById('today-habits-list');
    const today = getDateKey();
    
    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>No habits yet</h3>
                <p>Create your first habit to get started</p>
                <button onclick="showAddHabitModal()" class="btn btn-primary">Add Habit</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = habits.map(habit => {
        const completed = isCompleted(habit.id, today);
        const streak = getStreak(habit.id);
        const rate = getCompletionRate(habit.id);
        
        return `
            <div class="habit-card" style="--habit-color: ${habit.color}">
                <div class="habit-header">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
                    </div>
                    <div class="checkbox ${completed ? 'checked' : ''}" 
                         onclick="toggleCompletion('${habit.id}')"
                         data-habit="${habit.id}"
                         data-date="${today}">
                    </div>
                </div>
                <div class="habit-stats">
                    <div class="habit-stat">
                        <div class="habit-stat-label">Streak</div>
                        <div class="habit-stat-value streak">${streak} 🔥</div>
                    </div>
                    <div class="habit-stat">
                        <div class="habit-stat-label">30-day</div>
                        <div class="habit-stat-value completion">${rate}%</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAllHabits() {
    const container = document.getElementById('all-habits-list');
    
    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>No habits yet</h3>
                <p>Create your first habit to start tracking</p>
                <button onclick="showAddHabitModal()" class="btn btn-primary">Add Habit</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = habits.map(habit => {
        const streak = getStreak(habit.id);
        const rate = getCompletionRate(habit.id);
        const today = getDateKey();
        const completed = isCompleted(habit.id, today);
        
        return `
            <div class="habit-card" style="--habit-color: ${habit.color}">
                <div class="habit-header">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
                    </div>
                    <div class="habit-actions">
                        <button onclick="showEditHabitModal('${habit.id}')" class="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667.666.667-3.666 9-9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button onclick="deleteHabit('${habit.id}')" class="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="habit-stats">
                    <div class="habit-stat">
                        <div class="habit-stat-label">Current Streak</div>
                        <div class="habit-stat-value streak">${streak} days 🔥</div>
                    </div>
                    <div class="habit-stat">
                        <div class="habit-stat-label">Completion Rate</div>
                        <div class="habit-stat-value completion">${rate}%</div>
                    </div>
                    <div class="habit-stat">
                        <div class="habit-stat-label">Today</div>
                        <div class="checkbox ${completed ? 'checked' : ''}" 
                             onclick="toggleCompletion('${habit.id}')"
                             data-habit="${habit.id}"
                             data-date="${today}">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Analytics
let charts = {};

function updateAnalytics() {
    const period = document.getElementById('analytics-period').value;
    const habitId = document.getElementById('analytics-habit').value;
    
    updateHabitFilter();
    renderWeeklyChart(period, habitId);
    renderTrendChart(period, habitId);
    renderMonthlyChart(habitId);
    renderHabitComparisonChart();
    renderHeatmap();
}

function updateHabitFilter() {
    const select = document.getElementById('analytics-habit');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="all">All Habits</option>' +
        habits.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
    
    if (currentValue && habits.find(h => h.id === currentValue)) {
        select.value = currentValue;
    }
}

function renderWeeklyChart(period, habitId) {
    const canvas = document.getElementById('weekly-chart');
    const ctx = canvas.getContext('2d');
    
    if (charts.weekly) {
        charts.weekly.destroy();
    }
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map((_, index) => {
        const date = new Date();
        const dayOfWeek = date.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        date.setDate(date.getDate() + diff + index);
        
        const dateKey = getDateKey(date);
        const dayCompletions = completions[dateKey] || {};
        
        if (habitId === 'all') {
            return Object.values(dayCompletions).filter(Boolean).length;
        } else {
            return dayCompletions[habitId] ? 1 : 0;
        }
    });
    
    charts.weekly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Completions',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderTrendChart(period, habitId) {
    const canvas = document.getElementById('trend-chart');
    const ctx = canvas.getContext('2d');
    
    if (charts.trend) {
        charts.trend.destroy();
    }
    
    const weeks = 8;
    const labels = [];
    const data = [];
    
    for (let i = weeks - 1; i >= 0; i--) {
        labels.push(`Week ${weeks - i}`);
        
        let weekTotal = 0;
        for (let j = 0; j < 7; j++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7) - j);
            const dateKey = getDateKey(date);
            const dayCompletions = completions[dateKey] || {};
            
            if (habitId === 'all') {
                weekTotal += Object.values(dayCompletions).filter(Boolean).length;
            } else {
                weekTotal += dayCompletions[habitId] ? 1 : 0;
            }
        }
        
        data.push(weekTotal);
    }
    
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weekly Completions',
                data: data,
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderMonthlyChart(habitId) {
    const canvas = document.getElementById('monthly-chart');
    const ctx = canvas.getContext('2d');
    
    if (charts.monthly) {
        charts.monthly.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map((_, index) => {
        let monthTotal = 0;
        const today = new Date();
        const targetMonth = today.getMonth() - (5 - index);
        
        for (let day = 1; day <= 31; day++) {
            const date = new Date(today.getFullYear(), targetMonth, day);
            if (date.getMonth() !== (targetMonth < 0 ? 12 + targetMonth : targetMonth)) break;
            
            const dateKey = getDateKey(date);
            const dayCompletions = completions[dateKey] || {};
            
            if (habitId === 'all') {
                monthTotal += Object.values(dayCompletions).filter(Boolean).length;
            } else {
                monthTotal += dayCompletions[habitId] ? 1 : 0;
            }
        }
        
        return monthTotal;
    });
    
    charts.monthly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Completions',
                data: data,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 5 }
                }
            }
        }
    });
}

function renderHabitComparisonChart() {
    const canvas = document.getElementById('habit-comparison-chart');
    const ctx = canvas.getContext('2d');
    
    if (charts.comparison) {
        charts.comparison.destroy();
    }
    
    const labels = habits.map(h => h.name);
    const data = habits.map(h => getCompletionRate(h.id));
    const colors = habits.map(h => h.color);
    
    charts.comparison = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderHeatmap() {
    const container = document.getElementById('heatmap-container');
    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap';
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    
    for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = getDateKey(date);
        
        const dayCompletions = completions[dateKey] || {};
        const completedCount = Object.values(dayCompletions).filter(Boolean).length;
        const totalHabits = habits.length;
        
        let level = 0;
        if (totalHabits > 0) {
            const percentage = (completedCount / totalHabits) * 100;
            if (percentage >= 100) level = 4;
            else if (percentage >= 75) level = 3;
            else if (percentage >= 50) level = 2;
            else if (percentage > 0) level = 1;
        }
        
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.setAttribute('data-level', level);
        cell.title = `${date.toLocaleDateString()}: ${completedCount}/${totalHabits}`;
        
        heatmap.appendChild(cell);
    }
    
    container.innerHTML = '';
    container.appendChild(heatmap);
}

function showProfile() {
    alert(`Logged in as: ${currentUser.name}\nEmail: ${currentUser.email}`);
}