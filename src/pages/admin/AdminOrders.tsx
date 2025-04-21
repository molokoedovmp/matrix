import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, Order } from '../../services/orderService';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from '../../hooks/use-toast';
import { formatDate } from '../../lib/utils';

const statusColors = {
  'new': 'bg-blue-500',
  'processing': 'bg-yellow-500',
  'completed': 'bg-green-500',
  'cancelled': 'bg-red-500'
};

const statusLabels = {
  'new': 'Новый',
  'processing': 'В обработке',
  'completed': 'Выполнен',
  'cancelled': 'Отменен'
};

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('new');
  
  const queryClient = useQueryClient();
  
  // Запрос на получение всех заказов
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders
  });
  
  // Мутация для обновления статуса заказа
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: Order['status'] }) => 
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Статус обновлен',
        description: 'Статус заказа успешно обновлен'
      });
      setIsDetailsOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось обновить статус: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDetailsOpen(true);
  };
  
  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    
    updateStatusMutation.mutate({
      id: selectedOrder.id,
      status: newStatus
    });
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-matrix-green border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-red-500">
          Ошибка при загрузке заказов: {(error as Error).message}
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Управление заказами</h1>
        </div>
        
        {orders && orders.length > 0 ? (
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Клиент</TableHead>
                  <TableHead className="text-gray-400">Дата</TableHead>
                  <TableHead className="text-gray-400">Сумма</TableHead>
                  <TableHead className="text-gray-400">Статус</TableHead>
                  <TableHead className="text-gray-400">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-t border-gray-800">
                    <TableCell className="text-white font-mono">#{order.id}</TableCell>
                    <TableCell className="text-white">
                      <div>{order.customer_name}</div>
                      <div className="text-gray-400 text-sm">{order.customer_phone}</div>
                    </TableCell>
                    <TableCell className="text-white">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="text-white font-medium">{order.total_price.toLocaleString('ru-RU')} ₽</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[order.status]} text-white`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="bg-matrix-green/10 border-matrix-green/30 text-matrix-green hover:bg-matrix-green/20"
                      >
                        Подробнее
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
            <p className="text-gray-400">Заказы отсутствуют</p>
          </div>
        )}
      </div>
      
      {/* Диалог с деталями заказа */}
      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-black/95 border border-matrix-green/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Заказ #{selectedOrder.id}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Оформлен {formatDate(selectedOrder.created_at)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Информация о клиенте</h3>
                <div className="bg-black/50 rounded-md p-4 space-y-2">
                  <p><span className="text-gray-400">Имя:</span> {selectedOrder.customer_name}</p>
                  <p><span className="text-gray-400">Телефон:</span> {selectedOrder.customer_phone}</p>
                  <p><span className="text-gray-400">Email:</span> {selectedOrder.customer_email}</p>
                  <p><span className="text-gray-400">Адрес:</span> {selectedOrder.customer_address}</p>
                  {selectedOrder.comment && (
                    <p><span className="text-gray-400">Комментарий:</span> {selectedOrder.comment}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Товары</h3>
                <div className="bg-black/50 rounded-md p-4">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-black/70 rounded overflow-hidden mr-3">
                            <img 
                              src={item.image_url} 
                              alt={item.name} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-white">{item.name}</p>
                            <p className="text-gray-400 text-sm">{item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽</p>
                          </div>
                        </div>
                        <p className="text-white font-medium">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-between pt-2 font-bold">
                      <p>Итого:</p>
                      <p>{selectedOrder.total_price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Статус заказа</h3>
                <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                  <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-gray-700 text-white">
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Выполнен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                disabled={updateStatusMutation.isPending}
                className="bg-matrix-green text-black hover:bg-matrix-green/90"
              >
                {updateStatusMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminOrders; 