export const DEFAULT_CENTER: [number, number] = [52.15, 21.026];

// Стартовый масштаб карты при первом открытии.
export const DEFAULT_ZOOM = 15;

// Масштаб, к которому карта возвращается при центрировании на игроке.
export const PLAYER_FOCUS_ZOOM = 16;

// Таймаут запроса геолокации в миллисекундах.
export const GEOLOCATION_TIMEOUT_MS = 10000;

// Минимальное смещение карты от игрока, после которого показываем кнопку возврата.
export const LOCATE_BUTTON_SHOW_DISTANCE_METERS = 50;

// Длительность показа уведомления о завершении квеста.
export const QUEST_COMPLETION_NOTICE_MS = 3500;

export const FOG_OPACITY = 0.6;

export const BASE_COORDS: [number, number] = [52.1506, 21.0336];

// Максимальный радиус спавна игровых объектов от базовой точки.
export const MAX_DISTANCE_FROM_BASE = 1050;

// Радиус, в котором игрок видит и может собирать ближайшие объекты.
export const PLAYER_VISIBLE_RADIUS = 700;

// Количество монет, генерируемых на карте.
export const COINS_COUNT = 100;
