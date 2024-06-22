import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PagerDto } from '../common/dto/pager.dto';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected!!!');
  }

  async create( createProductDto: CreateProductDto ) {
    return await this.product.create({
      data: createProductDto
    });
  }

  async findAll( query: PagerDto ) {
     
    let { page = 0, limit = 10, filter = '', active } = query;
    
    let where: any = {
      status: true
    };
    let skip = ( page - 1 ) * limit;

    if( page == 0 ) {
      skip = 0;
      limit = 100;
    }

    if( filter !== '' ) {
      where.name = {
        startsWith: filter
      };
    }

    console.log('where ::: ', where);
    
    const [ data, total ] = await Promise.all([
      this.product.findMany({
        where,
        skip,
        take: limit
      }),

      this.product.count({ where })
    ])

    return { data, total };

  }

  async findOne( id: number ) {
    
    const product = await this.product.findUnique({
      where: {
        id
      }
    });

    if( !product ) throw new NotFoundException(`Product by id: ${ id }, not found`);

    return product;

  }

  async update( id: number, updateProductDto: UpdateProductDto ) {

    const { id: __, ...body } = updateProductDto;

    await this.findOne( id );
    
    return await this.product.update({
      where: { id },
      data: body
    });

  }

  async remove( id: number ) {
    const product = await this.findOne( id );
    
    return await this.product.update({
      where: { id },
      data: {
        status: !product.status
      }
    });
  }
}
