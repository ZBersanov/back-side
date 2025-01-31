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
import { CategoryService } from './category.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Auth()
	@HttpCode(200)
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.categoryService.getByStoreId(storeId)
	}


	@HttpCode(200)
	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return this.categoryService.getById(id)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':storeId')
	async create(@Body() dto: CategoryDto, @Param('storeId') storeId: string) {
		return this.categoryService.create(storeId, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async update(@Body() dto: CategoryDto, @Param('id') id: string) {
		return this.categoryService.update(id, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id)
	}
}
