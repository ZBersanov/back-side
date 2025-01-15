import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ColorService } from './color.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ColorDto } from './dto/color.dto'

@Controller('colors')
export class ColorController {
	constructor(private readonly colorService: ColorService) {}

	@Auth()
	@HttpCode(200)
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.colorService.getByStoreId(storeId)
	}

	@Auth()
	@HttpCode(200)
	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return this.colorService.getById(id)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':storeId')
	async create(@Body() dto: ColorDto, @Param('storeId') storeId: string) {
		return this.colorService.create(storeId, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async update(@Body() dto: ColorDto, @Param('id') id: string) {
		return this.colorService.update(id, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.colorService.delete(id)
	}
}
