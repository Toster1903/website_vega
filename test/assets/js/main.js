// Основной JavaScript файл
import { initNavigation } from './navigation.js';
import { initMenu } from './menu.js';
import { initBooking } from './booking.js';
import { initAuth } from './auth.js';
import { initNotifications } from './notifications.js';

// Инициализация всех модулей при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMenu();
    initBooking();
    initAuth();
    initNotifications();
}); 