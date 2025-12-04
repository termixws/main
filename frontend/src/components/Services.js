import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, Clock, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { StaggerContainer, StaggerItem, HoverScale } from './AnimatedContainer';
import { apiClient } from '../services/api';

// Mock data for demo
const mockServices = [
  { id: 1, name: 'Стрижка женская', description: 'Профессиональная стрижка с укладкой', price: 2500, duration: 60 },
  { id: 2, name: 'Окрашивание', description: 'Полное окрашивание волос любой сложности', price: 5000, duration: 120 },
  { id: 3, name: 'Маникюр', description: 'Классический маникюр с покрытием', price: 1500, duration: 45 },
  { id: 4, name: 'Педикюр', description: 'Педикюр с уходом и покрытием', price: 2000, duration: 60 },
];

export function Services() {
  const [services, setServices] = useState(mockServices);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getServices();
      if (data && data.length > 0) {
        setServices(data);
      }
    } catch (error) {
      console.log('Using mock data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createService(formData);
      setShowDialog(false);
      setFormData({ name: '', description: '', price: 0, duration: 0 });
      loadServices();
    } catch (error) {
      // Mock add
      const newService = { ...formData, id: Date.now() };
      setServices([...services, newService]);
      setShowDialog(false);
      setFormData({ name: '', description: '', price: 0, duration: 0 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.deleteService(id);
      loadServices();
    } catch (error) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Услуги</h2>
          <p className="text-sm text-muted-foreground">Каталог услуг салона</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </motion.div>
      </div>

      {/* Services Grid */}
      <StaggerContainer staggerDelay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <HoverScale>
                <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                        <Briefcase className="h-6 w-6 text-success" />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(service.id)}
                        className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{service.name}</h3>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        {service.price.toLocaleString()} ₽
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} мин</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerContainer>

      {services.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">Нет услуг</h3>
          <p className="text-sm text-muted-foreground">Добавьте первую услугу</p>
        </motion.div>
      )}

      {/* Add Service Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить услугу</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Название</Label>
              <Input
                id="service-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите название"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-desc">Описание</Label>
              <Textarea
                id="service-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание услуги"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-price">Цена (₽)</Label>
                <Input
                  id="service-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-duration">Длительность (мин)</Label>
                <Input
                  id="service-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  min={0}
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
              <Button type="submit">Добавить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
