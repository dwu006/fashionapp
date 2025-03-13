import React, { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
    // Get initial theme from localStorage or fallback to 'dark'
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'dark'
    );
    
    // Get initial auto-theme setting from localStorage or fallback to false
    const [autoTheme, setAutoTheme] = useState(
        localStorage.getItem('autoTheme') === 'true'
    );

    // Apply theme whenever it changes
    useEffect(() => {
        // Update localStorage
        localStorage.setItem('theme', theme);
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    // Set up auto theme toggling based on time of day
    useEffect(() => {
        localStorage.setItem('autoTheme', autoTheme);
        
        if (autoTheme) {
            // Initial theme setting based on time
            const updateThemeByTime = () => {
                const currentHour = new Date().getHours();
                // Day time is between 6 AM and 6 PM
                const isDayTime = currentHour >= 6 && currentHour < 18;
                setTheme(isDayTime ? 'light' : 'dark');
            };
            
            // Set theme immediately
            updateThemeByTime();
            
            // Check every hour for theme updates
            const interval = setInterval(updateThemeByTime, 60 * 60 * 1000);
            
            return () => clearInterval(interval);
        }
    }, [autoTheme]);

    // Toggle between light and dark
    const toggleTheme = () => {
        if (!autoTheme) {
            setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
        }
    };
    
    // Toggle auto theme
    const toggleAutoTheme = () => {
        setAutoTheme(prev => !prev);
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
                        disabled={autoTheme}
                    />
                    <span className="slider round">
                        <span className="toggle-icon">
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </span>
                    </span>
                </div>
            </label>
            
            <div className="auto-theme-toggle">
                <input 
                    type="checkbox" 
                    id="auto-theme-checkbox"
                    checked={autoTheme}
                    onChange={toggleAutoTheme}
                />
                <label className="auto-theme-label" htmlFor="auto-theme-checkbox">
                    Auto theme (day/night)
                </label>
            </div>
        </div>
    );
}

export default ThemeToggle;