import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	UsePipes,
	ValidationPipe,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductDto } from './dto/product.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.productService.getAll(searchTerm)
	}

	@Auth()
	@HttpCode(200)
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.productService.getByStoreId(storeId)
	}

	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return this.productService.getById(id)
	}

	@Get('by-category/:categotyId')
	async getByCategory(@Param('categotyId') id: string) {
		return this.productService.getByCategory(id)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.productService.getMostPopular()
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(id)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':storeId')
	async create(@Body() dto: ProductDto, @Param('storeId') storeId: string) {
		return this.productService.create(storeId, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async update(@Body() dto: ProductDto, @Param('id') id: string) {
		return this.productService.update(id, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.productService.delete(id)
	}
}
