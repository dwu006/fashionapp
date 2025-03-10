import React, { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
    // Get initial theme from localStorage or fallback to 'dark'
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'dark'
    );

    // Apply theme whenever it changes
    useEffect(() => {
        // Update localStorage
        localStorage.setItem('theme', theme);
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Toggle between light and dark
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="theme-toggle-container">
            <label className="theme-toggle">
                <span className="theme-label">Theme:</span>
                <div className="toggle-switch">
                    <input 
                        type="checkbox" 
                        checked={theme === 'light'}
                        onChange={toggleTheme}
                    />
                    <span className="slider round">
                        <span className="toggle-icon">
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </span>
                    </span>
                </div>
            </label>
        </div>
    );
}

export default ThemeToggle;