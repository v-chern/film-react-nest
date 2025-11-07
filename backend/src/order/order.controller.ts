import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CreateOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDTO) {
    this.logger.log(`Creating order`);
    return await this.orderService.createOrder(body);
  }
}
