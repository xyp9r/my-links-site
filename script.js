// --- 1. ЧАСЫ ---
function updateClock() {
	const clockElement = document.getElementById('clock');
	if (!clockElement) return;

	const now = new Date();

	// Настраиваем форматтер жестко на часовой пояс Варшавы
	const formatter = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Warsaw',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});

	const timeString = formatter.format(now);

	// Вставляем время и возвращаем палочку в конце
	clockElement.innerText = `${timeString} (Europe/Warsaw) |`;
}

// Запускаем часы каждую секунду
setInterval(updateClock, 1000);
updateClock(); // Вызываем один раз сразу , чтобы не было задержки при загрузке

// --- 2. SPOTIFY (Через ласт.фм апи)
const LASTFM_USER = 'emotype666';
const LASTFM_API_KEY = 'a9c821065d7e2331aa538bc700d77e75';

async function fetchSpotifyStatus() {
	try {
		// Стучимся к Last.fm
		const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`);
		const data = await response.json();

		// Достаем последний трек
		const track = data.recenttracks.track[0];

		// Проверяем играет ли оно прямо сейчас
		const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

		const songName = track.name;
		const artistName = track.artist['#text'];
		const coverUrl = track.image[2]['#text']; // Берем обложку хорошего качества

		// Находим элементы на странице
		const trackNameEl = document.querySelector('.track-name');
		const trackArtistEl = document.querySelector('.track-artist');
		const albumCoverEl = document.querySelector('.album-cover');

		// Обновляем текст и картинку
		trackNameEl.innerHTML = `<span class = "green-bars">||</span> ${songName}`;
		trackArtistEl.innerText = `by ${artistName}`;

		if (coverUrl) {
			albumCoverEl.style.backgroundImage = `url('${coverUrl}')`;
		}

		// Включаем или выключаем мигание
		if (isPlaying) {
			trackNameEl.classList.remove('is-paused');
			trackNameEl.classList.add('is-playing');
		} else {
			trackNameEl.classList.remove('is-playing');
			trackNameEl.classList.add('is-paused');
		}
	} catch (error) {
		console.error('Ошибка при загрузке Spotify:' , error);
		document.querySelector('.track-artist').innerText ='offline...';
	}
}

// Запускаем сразу при загрузке на страницу
fetchSpotifyStatus();

// Проверяем статус каждые 15 секунд
setInterval(fetchSpotifyStatus, 15000);

// --- 3. WAKATIME (Тройной запрос: Время, Языки, Программа) ---

// Твои три ссылки (Время за сегодня, Языки и Программы за 7 дней)
const WAKA_TIME_URL = 'https://wakatime.com/share/@xyp9r/b0c66321-93f5-479d-ac04-d5769a2b925a.json';
const WAKA_LANG_URL = 'https://wakatime.com/share/@xyp9r/19d44e2c-bb91-4d1e-bf4b-077f07a014cc.json';
const WAKA_EDITOR_URL = 'https://wakatime.com/share/@xyp9r/25fb8217-5513-40f5-9a94-d7012050c324.json';

// Глобальные переменные, чтобы склеить текст
let wakaLangText = '';
let wakaEditorText = '';

// Функция, которая склеивает языки и редактор в одну красивую строку
function updateWakaText() {
	const langEl = document.getElementById('waka-languages');

	if (wakaLangText && wakaEditorText) {
		// Если вакатайм отдал языки и редактор
		langEl.innerText = `7d stack: ${wakaLangText} in ${wakaEditorText}`;
	} else if (wakaLangText) {
		// Редактор пока недоступен
		langEl.innerText = `7d stack: ${wakaLangText}`;
	} else {
		// Загрузка если кэш вакатайм пустой
		langEl.innerText = "system processing...";
	}
}

// 1. Приемник для ВРЕМЕНИ (за сегодня)
window.wakaTimeCallback = function(response) {
    try {
        const todayData = response.data[response.data.length - 1];
        const totalTime = todayData.grand_total.text;

        const timeEl = document.getElementById('waka-hours');
        const iconEl = document.querySelector('.wakatime-icon');
        const langEl = document.getElementById('waka-languages');

        if (totalTime === "0 secs" || !totalTime) {
            timeEl.innerText = "system idle...";
            langEl.innerText = "waiting for input";
            iconEl.classList.remove('active-mode');
        } else {
            timeEl.innerText = totalTime; // Вставляем минуты
            iconEl.classList.add('active-mode'); // Врубаем зеленый неон
            updateWakaText(); // Обновляем нижнюю строчку
        }
    } catch (error) {
        console.error('Ошибка WakaTime (Time): ', error);
        document.getElementById('waka-hours').innerText = "offline";
    }
};

// 2. Приемник для ЯЗЫКОВ (за 7 дней)
window.wakaLangCallback = function(response) {
    try {
        if (response.data && response.data.length > 0) {
            // Берем только топ-2 языка, чтобы текст не вылез за края
            wakaLangText = response.data.slice(0, 2).map(item => item.name).join(', ');
            updateWakaText();
        }
    } catch (error) {
        console.error('Ошибка WakaTime (Lang): ', error);
    }
};

// 3. Приемник для РЕДАКТОРА (за 7 дней)
window.wakaEditorCallback = function(response) {
    try {
        if (response.data && response.data.length > 0) {
            // Берем самую популярную программу (Sublime Text)
            wakaEditorText = response.data[0].name;
            updateWakaText();
        }
    } catch (error) {
        console.error('Ошибка WakaTime (Editor): ', error);
    }
};

// Универсальный курьер для отправки запросов
function addJsonpScript(id, url, callbackName) {
    const oldScript = document.getElementById(id);
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = id;
    script.src = `${url}?callback=${callbackName}`;
    document.body.appendChild(script);
}

// Запускаем всех трех курьеров одновременно
function fetchAllWakaData() {
    addJsonpScript('waka-time-script', WAKA_TIME_URL, 'wakaTimeCallback');
    addJsonpScript('waka-lang-script', WAKA_LANG_URL, 'wakaLangCallback');
    addJsonpScript('waka-editor-script', WAKA_EDITOR_URL, 'wakaEditorCallback');
}

// Старт при загрузке
fetchAllWakaData();

// Обновляем раз в 60 секунд
setInterval(fetchAllWakaData, 60000);

// --- 4. СЧЕТЧИК ПРОСМОТРОВ ---
async function updatePageViews() {
	try {
		// уникальное имя сайта xyp9r-terminal
		const response = await fetch('https://api.counterapi.dev/v1/xyp9r-terminal/visits/up');
		const data = await response.json();

		// Находим элемент и вставляем реальную цифру
		const viewsEl = document.getElementById('view-count');
		if (viewsEl && data.count) {
			viewsEl.innerText = data.count;
		}
	} catch (error) {
		console.error('Ошибка счетчика: ', error);
		// Если база лагает, оставляем стильный статус
		document.getElementById('view-count').innerText = "sys error";
	}
}

updatePageViews();

// --- 6. КАСТОМНОЕ МЕНЮ ---
const customMenu = document.getElementById('custom-menu');

// слушаем правый клик
document.addEventListener('contextmenu', (e) => {
	e.preventDefault(); // убираем скучно меню браузера

	// Показываю свое меню
	customMenu.style.display = 'block';

	// рассчитываем координаты, чтобы меню не вылезало за края экрана
	let x = e.clientX;
	let y = e.clientY;

	if (x + customMenu.offsetWidth > window.innerWidth) {
		x = window.innerWidth - customMenu.offsetWidth - 5;
	}
	if (y + customMenu.offsetHeight > window.innerHeight) {
		y = window.innerHeight - customMenu.offsetHeight - 5;
	}

	customMenu.style.left = `${x}px`;
	customMenu.style.top = `${y}px`;
});

// Закрываем левым кликом куда угодно
document.addEventListener('click' , (e) => {
	if (e.button !== 2) {
		customMenu.style.display = 'none';
	}
});

// Закрываем по esc
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		customMenu.style.display = 'none';
	}
});

// Действия при клике на пункту меню
window.menuAction = function(action) {
	customMenu.style.display = 'none'; // Прячем меню

	if (action === 'copy') {
		document.execCommand('copy');
	} else if (action === 'selectAll') {
		document.execCommand('selectAll');
	} else if (action === 'reload') {
		location.reload();
	}
};