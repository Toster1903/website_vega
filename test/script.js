document.addEventListener('DOMContentLoaded', () => {
    // Добавляем плавную прокрутку для навигации
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Добавляем анимацию появления элементов при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });

    // Устанавливаем текущую дату в поле выбора даты
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('booking-date').value = formattedDate;
    
    // Обработчик для кнопок "Буду есть"
    document.querySelectorAll('.btn.primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события на карточку
            
            if (this.closest('form')) return; // Пропускаем кнопки в формах
            
            this.textContent = 'Добавлено';
            this.style.backgroundColor = '#A7C957';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.textContent = 'Буду есть';
                this.style.backgroundColor = '';
                this.style.transform = '';
            }, 2000);
        });
    });
    
    // Обработчик для кнопок бронирования
    document.querySelectorAll('.btn.secondary').forEach(button => {
        button.addEventListener('click', function() {
            const slotCard = this.closest('.slot-card');
            const timeSlot = slotCard.querySelector('.time').textContent;
            
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Показываем уведомление
            showNotification(`Вы забронировали время: ${timeSlot}`);
        });
    });
    
    // Добавляем эффект при наведении на карточки меню
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Добавляем обработчик клика для показа подробной информации
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const price = this.querySelector('.price').textContent;
            
            // Данные о пищевой ценности (в реальном приложении эти данные будут храниться в базе данных)
            const nutritionData = {
                'Борщ украинский': {
                    calories: 120,
                    proteins: 5.2,
                    fats: 4.8,
                    carbs: 15.3,
                    ingredients: 'Свекла, капуста, картофель, морковь, лук, томатная паста, говядина, сметана, чеснок'
                },
                'Котлета по-киевски': {
                    calories: 350,
                    proteins: 22.5,
                    fats: 18.7,
                    carbs: 25.3,
                    ingredients: 'Куриное филе, сливочное масло, панировочные сухари, яйцо, специи, картофельное пюре, овощи'
                },
                'Салат "Цезарь"': {
                    calories: 280,
                    proteins: 18.3,
                    fats: 15.2,
                    carbs: 12.8,
                    ingredients: 'Куриная грудка, салат романо, пармезан, сухарики, соус цезарь, яйцо'
                },
                'Паста Карбонара': {
                    calories: 420,
                    proteins: 15.8,
                    fats: 22.5,
                    carbs: 35.6,
                    ingredients: 'Спагетти, бекон, яйцо, пармезан, черный перец, сливки, чеснок'
                },
                'Тирамису': {
                    calories: 280,
                    proteins: 5.2,
                    fats: 12.8,
                    carbs: 35.6,
                    ingredients: 'Маскарпоне, печенье савоярди, кофе, какао, яйцо, сахар'
                },
                'Чай/Кофе': {
                    calories: 5,
                    proteins: 0.1,
                    fats: 0,
                    carbs: 1.2,
                    ingredients: 'Чайные листья или кофейные зерна, вода'
                }
            };
            
            // Получаем данные о пищевой ценности для выбранного блюда
            const nutrition = nutritionData[title] || {
                calories: 0,
                proteins: 0,
                fats: 0,
                carbs: 0,
                ingredients: 'Информация отсутствует'
            };
            
            // Создаем и показываем модальное окно с подробной информацией
            showProductModal(title, description, price, nutrition);
        });
    });
    
    // Обработчик для кнопки "Регистрация" на странице бронирования
    document.getElementById('show-register').addEventListener('click', function() {
        document.getElementById('auth').scrollIntoView({ behavior: 'smooth' });
        // Активируем вкладку регистрации
        const registerTab = document.querySelector('.auth-tab-btn[data-tab="register"]');
        if (registerTab) {
            registerTab.click();
        }
    });

    // Обработчик для ссылки "Войти" на форме регистрации
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        const loginTab = document.querySelector('.auth-tab-btn[data-tab="login"]');
        if (loginTab) {
            loginTab.click();
        }
    });
    
    // Обработчик для переключения вкладок авторизации
    document.querySelectorAll('.auth-tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс со всех вкладок
            document.querySelectorAll('.auth-tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем все формы
            document.querySelectorAll('#register-form-container, #login-form-container').forEach(form => {
                form.classList.add('hidden');
            });
            
            // Показываем выбранную форму
            const targetTab = this.getAttribute('data-tab');
            if (targetTab === 'register') {
                document.getElementById('register-form-container').classList.remove('hidden');
            } else if (targetTab === 'login') {
                document.getElementById('login-form-container').classList.remove('hidden');
            }
        });
    });
    
    // Обработчик для формы входа
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Здесь будет логика отправки данных на сервер
        console.log('Вход:', { email, password });
        
        // Показываем уведомление об успешном входе
        showNotification('Вы успешно вошли в систему!');
    });
    
    // Обработчик для формы регистрации
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const lastname = document.getElementById('register-lastname').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        
        if (password !== passwordConfirm) {
            showNotification('Пароли не совпадают!', 'error');
            return;
        }
        
        // Здесь будет логика отправки данных на сервер
        console.log('Регистрация:', { name, lastname, email, password });
        
        // Показываем уведомление об успешной регистрации
        showNotification('Вы успешно зарегистрировались!');
    });
    
    // Обработчик для ссылки "Регистрация" в форме входа
    document.getElementById('show-register-link').addEventListener('click', function(e) {
        e.preventDefault();
        const registerTab = document.querySelector('.auth-tab-btn[data-tab="register"]');
        if (registerTab) {
            registerTab.click();
        }
    });
    
    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? '#7AB5E6' : '#BC4749';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '15px';
        notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease-out';
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Анимация исчезновения
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Функция для показа модального окна с подробной информацией о продукте
    function showProductModal(title, description, price, nutrition) {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '2000';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-out';
        
        // Создаем содержимое модального окна
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '20px';
        modalContent.style.padding = '30px';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.position = 'relative';
        modalContent.style.transform = 'translateY(20px)';
        modalContent.style.transition = 'transform 0.3s ease-out';
        
        // Заголовок
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.color = '#7AB5E6';
        modalTitle.style.marginBottom = '15px';
        modalTitle.style.fontSize = '24px';
        
        // Описание
        const modalDescription = document.createElement('p');
        modalDescription.textContent = description;
        modalDescription.style.marginBottom = '20px';
        modalDescription.style.color = '#555';
        
        // Цена
        const modalPrice = document.createElement('p');
        modalPrice.textContent = price;
        modalPrice.style.fontWeight = 'bold';
        modalPrice.style.color = '#BC4749';
        modalPrice.style.fontSize = '18px';
        modalPrice.style.marginBottom = '20px';
        
        // Пищевая ценность
        const nutritionTitle = document.createElement('h3');
        nutritionTitle.textContent = 'Пищевая ценность (на 100г):';
        nutritionTitle.style.marginBottom = '10px';
        nutritionTitle.style.fontSize = '18px';
        nutritionTitle.style.color = '#333';
        
        const nutritionList = document.createElement('ul');
        nutritionList.style.listStyle = 'none';
        nutritionList.style.padding = '0';
        nutritionList.style.marginBottom = '20px';
        
        const nutritionItems = [
            { label: 'Калории', value: nutrition.calories, unit: 'ккал' },
            { label: 'Белки', value: nutrition.proteins, unit: 'г' },
            { label: 'Жиры', value: nutrition.fats, unit: 'г' },
            { label: 'Углеводы', value: nutrition.carbs, unit: 'г' }
        ];
        
        nutritionItems.forEach(item => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.padding = '8px 0';
            li.style.borderBottom = '1px solid #eee';
            
            const label = document.createElement('span');
            label.textContent = item.label;
            label.style.color = '#555';
            
            const value = document.createElement('span');
            value.textContent = `${item.value} ${item.unit}`;
            value.style.fontWeight = 'bold';
            value.style.color = '#333';
            
            li.appendChild(label);
            li.appendChild(value);
            nutritionList.appendChild(li);
        });
        
        // Состав
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Состав:';
        ingredientsTitle.style.marginBottom = '10px';
        ingredientsTitle.style.fontSize = '18px';
        ingredientsTitle.style.color = '#333';
        
        const ingredientsList = document.createElement('p');
        ingredientsList.textContent = nutrition.ingredients;
        ingredientsList.style.marginBottom = '20px';
        ingredientsList.style.color = '#555';
        
        // Кнопка закрытия
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.backgroundColor = '#7AB5E6';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px 20px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'background-color 0.3s';
        
        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#5A95C6';
        });
        
        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#7AB5E6';
        });
        
        // Кнопка "Добавить в корзину"
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Добавить в корзину';
        addToCartButton.style.backgroundColor = '#A7C957';
        addToCartButton.style.color = 'white';
        addToCartButton.style.border = 'none';
        addToCartButton.style.padding = '10px 20px';
        addToCartButton.style.borderRadius = '5px';
        addToCartButton.style.cursor = 'pointer';
        addToCartButton.style.fontWeight = 'bold';
        addToCartButton.style.marginRight = '10px';
        addToCartButton.style.transition = 'background-color 0.3s';
        
        addToCartButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#87B947';
        });
        
        addToCartButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#A7C957';
        });
        
        addToCartButton.addEventListener('click', function() {
            showNotification(`"${title}" добавлено в корзину!`);
            closeModal();
        });
        
        // Контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '20px';
        
        // Добавляем кнопки в контейнер
        buttonContainer.appendChild(addToCartButton);
        buttonContainer.appendChild(closeButton);
        
        // Собираем модальное окно
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(modalPrice);
        modalContent.appendChild(nutritionTitle);
        modalContent.appendChild(nutritionList);
        modalContent.appendChild(ingredientsTitle);
        modalContent.appendChild(ingredientsList);
        modalContent.appendChild(buttonContainer);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
        
        // Функция закрытия модального окна
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
        
        // Обработчик для кнопки закрытия
        closeButton.addEventListener('click', closeModal);
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Закрытие по нажатию клавиши Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
});
