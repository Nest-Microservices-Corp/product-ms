import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PagerDto } from '../common/dto/pager.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit {

  private readonly _logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this._logger.log('Database connected!!!');
  }

  async create( createProductDto: CreateProductDto ) {

    try {
      
      return await this.product.create({
        data: createProductDto
      });

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error al crear producto',
        error
      });
    }

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
        id,
        status: true
      }
    });

    if( !product ) {
      throw new RpcException({
        status: 404,
        message: `Product by id: ${ id }, not found`
      });
    }
      
    // NotFoundException -> RpcException

    return product;

  }

  async update( id: number, updateProductDto: UpdateProductDto ) {

    try {
      
      const { id: __, ...body } = updateProductDto;

      await this.findOne( id );
      
      return await this.product.update({
        where: { id },
        data: body
      });

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error al actualizar producto'
      });
    }

  }

  async remove( id: number ) {
    await this.findOne( id );
    
    return await this.product.update({
      where: { id },
      data: {
        status: false
      }
    });
  }

  async validateProducts( ids: number[] ) {
    
    try {
      // eliminar duplicados
      ids = Array.from( new Set( ids ) );

      const products = await this.product.findMany({
        where: {
          id: {
            in: ids,
          },
          // status: true
        }
      });

      if( products.length !== ids.length ) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Some products were not found'
        });
      }
      
      return products;
      
    } catch (error) {
      this._logger.log( error );
      throw new RpcException(error);
    }

  }

}
