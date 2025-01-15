import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { FileResponse } from './file.inteface'

@Injectable()
export class FileService {
	async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
		const uploadedFolder = `${path}/uploads/${folder}` //  path - корневая папка

		await ensureDir(uploadedFolder) // ensureDir - Если папки uploads/products ещё не существует, она будет создана.

		const response: FileResponse[] = await Promise.all(
			files.map(async file => {
				const originalName = `${Date.now()}-${file.originalname}`

				await writeFile(
					// writeFile Записывает содержимое файла в указанную директорию и имя файл
					`${uploadedFolder}/${originalName}`,
					file.buffer // file.buffer Содержит бинарные данные файла, которые будут записаны на диск
				)

				return {
					url: `/uploads/${folder}/${originalName}`,
					name: originalName
				}
			})
		)

		return response
	}
}
