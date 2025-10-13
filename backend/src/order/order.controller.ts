import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDTO) {
    return await this.orderService.createOrder(body);
  }
}
