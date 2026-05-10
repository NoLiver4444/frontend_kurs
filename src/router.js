// src/router.js
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.appContainer = null;
    
    // Слушаем изменение хэша
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  // Регистрация маршрута
  addRoute(path, componentClass, props = {}) {
    this.routes.set(path, { componentClass, props });
  }

  // Навигация к маршруту
  navigate(path) {
    window.location.hash = path;
  }

  // Обработка текущего маршрута
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'tournaments';
    const routeConfig = this.routes.get(hash);
    
    // Очищаем контейнер
    if (this.appContainer) {
      this.appContainer.innerHTML = '';
      
      // Уничтожаем предыдущий компонент (если есть метод destroy)
      if (this.currentRoute?.instance?.destroy) {
        this.currentRoute.instance.destroy();
      }
    }

    if (routeConfig) {
      const { componentClass, props } = routeConfig;
      const instance = new componentClass(props);
      
      // Рендерим компонент
      const element = instance.render();
      if (element) {
        this.appContainer.appendChild(element);
        
        // Вызываем init если есть (для асинхронной загрузки данных)
        if (instance.init && typeof instance.init === 'function') {
          instance.init();
        }
      }
      
      this.currentRoute = { path: hash, instance };
    } else {
      // 404 - редирект на главную
      this.navigate('tournaments');
    }
  }

  // Установка контейнера приложения
  setContainer(container) {
    this.appContainer = container;
  }
}