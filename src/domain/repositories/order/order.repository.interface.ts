import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import { Order, OrderId } from '../../entities/order/order.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderRepositoryInterface {
  save(order: Order): Promise<Order>; // Retorna a Order persistida
  findById(orderId: OrderId): Promise<Order | null>;
  findAll(limit: number, skip: number): Promise<{ currentPage: number; totalPages: number; data: Order[] }>;
  update(order: Order): Promise<Order>; // Também deve retornar Order
  remove(orderId: OrderId): Promise<void>;
  findByStatusPayment(statusPayment: string): Promise<{ data: Order[] }>;
}
