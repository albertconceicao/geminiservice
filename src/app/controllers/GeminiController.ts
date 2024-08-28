import fs from 'fs';
import path from 'path';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import mime from 'mime-types';

import logger from '../utils/logger';

export class GeminiController {
	/** ------------------------------------------------------------------------------
	 * @function readImage
	 *
	 */
	async readImage(image: string) {
		logger.info('readImage >> Start');
		try {
			const imageParts = image.split(';base64,');

			const imageType = imageParts[0].split('/')[1];
			const mimeType = mime.lookup(imageType).toString();

			const imageBuffer = Buffer.from(imageParts[1], 'base64');
			const imagePath = path.join(
				__dirname,
				'..',
				'uploads',
				`temp_image.${imageType}`,
			);

			fs.writeFileSync(imagePath, imageBuffer);
			const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
			const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

			const absoluteImagePath = path.join(
				__dirname,
				'..',
				'uploads',
				`temp_image.${imageType}`,
			);
			const uploadResponse = await fileManager.uploadFile(absoluteImagePath, {
				mimeType,
				displayName: 'test',
			});
			console.log(
				`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
			);

			const model = genAI.getGenerativeModel({
				model: 'gemini-1.5-flash',
			});
			const result = await model.generateContent([
				{
					fileData: {
						mimeType: uploadResponse.file.mimeType,
						fileUri: uploadResponse.file.uri,
					},
				},
				{ text: 'Return only the numbers of the value of the measure' },
			]);
			const measureValue = result.response.text();
			return measureValue;
		} catch (error) {
			logger.error('readImage :: Error :: ', error);
		}
	}
}
