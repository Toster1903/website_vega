// Модуль бронирования
import { showNotification } from './notifications.js';

export function initBooking() {
    const bookingForm = document.querySelector('#booking-form');
    const dateInput = document.querySelector('#date');
    const timeInput = document.querySelector('#time');
    const guestsInput = document.querySelector('#guests');
    const nameInput = document.querySelector('#name');
    const phoneInput = document.querySelector('#phone');
    const emailInput = document.querySelector('#email');
    const commentInput = document.querySelector('#comment');
    
    // Устанавливаем минимальную дату (сегодня)
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    dateInput.min = todayFormatted;
    
    // Устанавливаем максимальную дату (через 30 дней)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateFormatted = maxDate.toISOString().split('T')[0];
    dateInput.max = maxDateFormatted;
    
    // Устанавливаем доступное время (с 10:00 до 22:00)
    const timeSlots = [];
    for (let hour = 10; hour <= 22; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    // Заполняем select времени
    timeInput.innerHTML = timeSlots.map(time => 
        `<option value="${time}">${time}</option>`
    ).join('');
    
    // Валидация формы
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // Проверка имени
        if (nameInput.value.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
            isValid = false;
        }
        
        // Проверка телефона
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(phoneInput.value.replace(/\D/g, ''))) {
            errors.push('Введите корректный номер телефона');
            isValid = false;
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            errors.push('Введите корректный email');
            isValid = false;
        }
        
        // Проверка количества гостей
        const guests = parseInt(guestsInput.value);
        if (isNaN(guests) || guests < 1 || guests > 20) {
            errors.push('Количество гостей должно быть от 1 до 20');
            isValid = false;
        }
        
        // Проверка даты и времени
        const selectedDate = new Date(dateInput.value);
        const selectedTime = timeInput.value;
        const selectedDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        selectedDateTime.setHours(parseInt(hours), parseInt(minutes));
        
        if (selectedDateTime < new Date()) {
            errors.push('Выбранное время уже прошло');
            isValid = false;
        }
        
        return { isValid, errors };
    }
    
    // Обработчик отправки формы
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const { isValid, errors } = validateForm();
        
        if (!isValid) {
            showNotification(errors.join('\n'), 'error');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            date: dateInput.value,
            time: timeInput.value,
            guests: guestsInput.value,
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            comment: commentInput.value
        };
        
        // В реальном приложении здесь будет отправка данных на сервер
        console.log('Данные бронирования:', formData);
        
        // Показываем уведомление об успешном бронировании
        showNotification('Бронирование успешно создано! Мы свяжемся с вами для подтверждения.', 'success');
        
        // Очищаем форму
        bookingForm.reset();
    });
    
    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] !== '7') {
                value = '7' + value;
            }
            let formattedValue = '+';
            for (let i = 0; i < value.length; i++) {
                if (i === 1) formattedValue += ' (';
                if (i === 4) formattedValue += ') ';
                if (i === 7 || i === 9) formattedValue += '-';
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        }
    });
    
    // Ограничение на количество гостей
    guestsInput.addEventListener('input', function(e) {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 20) {
            e.target.value = 20;
        }
    });
    
    // Обработчик изменения даты
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        
        // Если выбрана сегодняшняя дата, показываем только будущее время
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const availableTimeSlots = timeSlots.filter(time => {
                const [hours] = time.split(':');
                return parseInt(hours) > currentHour;
            });
            
            timeInput.innerHTML = availableTimeSlots.map(time => 
                `<option value="${time}">${time}</option>`
            ).join('');
        } else {
            // Для других дат показываем все время
            timeInput.innerHTML = timeSlots.map(time => 
                `<option value="${time}">${time}</option>`
            ).join('');
        }
    });
} 