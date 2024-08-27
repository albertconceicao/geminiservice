import logger from './app/utils/logger';
import app from './config/serverConfig';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
	logger.info(`Server started at http://localhost:${PORT}`),
);
