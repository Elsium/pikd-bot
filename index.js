const telegramApi = require('node-telegram-bot-api')
require('dotenv').config();

const bot = new telegramApi(process.env.TOKEN, {polling: true})

const users = {
	5251471811: {
		reg: false,
		auth: true,
		done: true,
		lab: 5,
		practic: 3,
		admin: true,
		name: 'Дмитрий',
		lastname: 'Ли',
		chatID: 5251471811
	}
}

bot.setMyCommands([
	{command: '/start', description: 'Начать процедуру регистрации'},
	{command: '/stop', description: 'Отменить процедуру регистрации'},
])

const sendRequest = (chatID) => {
	 for(key in users) {
		 if(users[key].admin) {
			 bot.sendMessage(users[key].chatID, 'Нужно распределить ' + users[chatID].name + ' ' + users[chatID].lastname + '.');
		 }
	 }
	 console.log(users);
}

const start = () => {
	bot.on('message', async msg => {
		const text = msg.text;
		const chatID = msg.chat.id;
		const userID = msg.from.id;
		if (text ==='/start') {
			if (users[chatID] === undefined || !users[chatID].auth) {
				users[chatID] = {reg: true, auth: false, done: false, lab: 0, practic: 0, admin: false};
				return bot.sendMessage(chatID, ('Привет, ' + msg.from.first_name + '. Напиши свои реальные имя и фамилию, чтобы староста распределил тебя в нужную группу.' +
					'\nПример: Ли Дмитрий'));
			} else if (users[chatID].auth && users[chatID].done) {
				return bot.sendMessage(chatID, 'Ты уже зарегистрирован и распределен.');
			} else {
				return bot.sendMessage(chatID, 'Тебя распределяют.');
			}
		}
		if (text ==='/stop') {
			if (users[chatID] === undefined) return bot.sendMessage(chatID, 'Регистрация не начиналась.')
			if (!users[chatID].auth) {
				users[chatID] = {reg: false};
				return bot.sendMessage(chatID, ('Регистрация отменена.'));
			} else if (users[chatID].auth && users[chatID].done) {
				return bot.sendMessage(chatID, 'Ты уже зарегистрирован и распределен.');
			} else {
				return bot.sendMessage(chatID, 'Тебя распределяют.');
			}
		}
		if (users[chatID].reg) {
			const name = text.split(' ');
			if(name.length === 2) {
				const first = name[0], second = name[1];
				users[chatID] = {reg: false, auth: true, name: first, lastname: second, chatID: userID};
				sendRequest(chatID);
				return bot.sendMessage(chatID, 'Успешно, ожидай, пока старосты добавят тебя в твои группы');
			} else {
				return bot.sendMessage(chatID, 'Неправильный формат имени и фамилии');
			}
		}
	});
}
start()

