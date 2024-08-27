import kleur from 'kleur';
import winston from 'winston';

function getLocalizedWeekday(locale: string) {
	const options = { weekday: 'long' as const };
	return new Date().toLocaleDateString(locale, options);
}

const customFormat = winston.format.printf(
	({ level, message, timestamp, callingFile }) => {
		let formattedMessage = '';
		const localizedWeekday = getLocalizedWeekday(process.env.LOCALE || 'pt-BR');

		switch (level.toLowerCase()) {
			case 'info':
				formattedMessage = `${kleur
					.bgGreen()
					.black(`${localizedWeekday}, ${timestamp}`)} | ${kleur
					.bgBlack()
					.white(`${kleur.blue(level.toUpperCase())}`)} | ${kleur
					.bgBlack()
					.white(`${callingFile ? `'${callingFile}' | ` : ''}${message}`)}`;
				break;
			case 'error':
				formattedMessage = `${kleur
					.bgRed()
					.black(`${localizedWeekday}, ${timestamp}`)} | ${kleur
					.bgBlack()
					.white(`${kleur.red(level.toUpperCase())}`)} | ${kleur
					.bgBlack()
					.white(`${callingFile ? `'${callingFile}' | ` : ''}${message}`)}`;
				break;
			case 'debug':
				formattedMessage = `${kleur
					.bgYellow()
					.black(`${localizedWeekday}, ${timestamp}`)} | ${kleur
					.bgBlack()
					.white(`${kleur.yellow(level.toUpperCase())}`)} | ${kleur
					.bgBlack()
					.white(`${callingFile ? `'${callingFile}' | ` : ''}${message}`)}`;
				break;
			default:
				formattedMessage = `${localizedWeekday}, ${timestamp} | ${level.toUpperCase()} | ${
					callingFile ? `'${callingFile}' | ` : ''
				}${message}`;
				break;
		}

		return formattedMessage;
	},
);

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'DD MMM YYYY HH:mm:ss [GMT]' }),
		customFormat,
	),
	transports:
		process.env.LOG_LEVEL === 'debug'
			? [
					new winston.transports.Console(),
					new winston.transports.File({ filename: 'logs/combined.log' }),
				]
			: [new winston.transports.Console()],
});

export default logger;
