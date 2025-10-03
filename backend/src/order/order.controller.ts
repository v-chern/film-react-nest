import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDTO) {
    let retVal = {};

    try {
      retVal = await this.orderService.createOrder(body);
    } catch (error) {
      throw new HttpException(
        {
          error: error.message
          
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return retVal;
  }
}
