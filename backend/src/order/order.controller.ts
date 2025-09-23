import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  @Post()
  createOrder(@Body() body: CreateOrderDTO) {
    return {message: "Order is created", payload: body};
  }
}
