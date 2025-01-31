import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.getSearchTermFilter(searchTerm)

		return await this.prisma.product.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				category: true
			}
		})
	}

	async getByStoreId(storeId: string) {
		return await this.prisma.product.findMany({
			where: {
				storeId
			},
			include: {
				category: true,
				color: true
			}
		})
	}

	async getById(id: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				id
			},
			include: {
				category: true,
				color: true,
				reviews: {
					include: {
						user: true
					}
				}
			}
		})

		if (!product) throw new NotFoundException('Товар не найден')

		return product
	}

	async getByCategory(categoryId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				categoryId
			},
			include: {
				category: true
			}
		})

		if (!products) throw new NotFoundException('Товар не найден')

		return products
	}

	private async getSearchTermFilter(searchTerm: string) {
		return this.prisma.product.findMany({
			where: {
				OR: [
					{
						title: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			},
			include: {
				category: true
			}
		})
	}

	async getMostPopular() {
		// Группируем товары по популярности
		const mostPopularProducts = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			_count: {
				id: true
			},
			orderBy: {
				_count: {
					id: 'desc'
				}
			}
		})

		// Собираем только валидные productId
		const productIds = mostPopularProducts
			.map(item => item.productId)
			.filter(id => id !== null && id !== undefined) // Исключаем null и undefined

		// Если массив пустой, сразу возвращаем пустой результат
		if (productIds.length === 0) {
			return []
		}

		// Получаем продукты по их ID
		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productIds
				}
			},
			include: {
				category: true
			}
		})

		return products
	}

	async getSimilar(id: string) {
		const currentProduct = await this.getById(id)

		if (!currentProduct)
			throw new NotFoundException('Такой товар не найден')

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					title: currentProduct.category.title
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				category: true
			}
		})
		return products
	}

	async create(storeId: string, dto: ProductDto) {
		return await this.prisma.product.create({
			data: {
				title: dto.title,
				description: dto.description,
				price: dto.price,
				images: dto.images,
				categoryId: dto.categoryId,
				colorId: dto.colorId,
				storeId
			}
		})
	}

	async update(id: string, dto: ProductDto) {
		await this.getById(id)

		return await this.prisma.product.update({
			where: { id },
			data: dto
		})
	}

	async delete(id: string) {
		await this.getById(id)

		return await this.prisma.product.delete({
			where: { id }
		})
	}
}
