import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PagerDto } from '../common/dto/pager.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {

  // FIXME: Los microservicios ya no trabajan con los decoradores de peticion (POST:GET:PUT...)
  // sino trabajan con MessagePatern o EventPattern

  constructor(private readonly productService: ProductService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create( @Payload() createProductDto: CreateProductDto ) {
    return this.productService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_product' })
  findAll( @Payload() query: PagerDto ) {
    return this.productService.findAll( query );
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne( @Payload('id', ParseIntPipe ) id: number ) {
    return this.productService.findOne( id );
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update( 
    // @Payload('id', ParseIntPipe) id: number, 
    @Payload() updateProductDto: UpdateProductDto ) {
    return this.productService.update( updateProductDto.id, updateProductDto );
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove( @Payload('id', ParseIntPipe) id: number) {
    return this.productService.remove( id );
  }

  @MessagePattern({ cmd: 'validate_product' })
  validateProduct( @Payload('ids') ids: number[] ) {
    return this.productService.validateProducts( ids );
  }

}
