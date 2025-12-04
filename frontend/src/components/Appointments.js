import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, User, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { StaggerContainer, StaggerItem, HoverScale } from './AnimatedContainer';
import { apiClient } from '../services/api';

// Mock data for demo
const mockAppointments = [
  { id: 1, date_time: '2024-12-20T10:00:00', status: 'scheduled', user_id: 1, master_id: 1, service_id: 1, user_email: 'client@example.com', master_name: 'Анна Иванова', service_name: 'Стрижка женская' },
  { id: 2, date_time: '2024-12-20T14:00:00', status: 'confirmed', user_id: 2, master_id: 2, service_id: 2, user_email: 'maria@example.com', master_name: 'Мария Петрова', service_name: 'Окрашивание' },
  { id: 3, date_time: '2024-12-21T11:00:00', status: 'scheduled', user_id: 1, master_id: 3, service_id: 3, user_email: 'client@example.com', master_name: 'Елена Сидорова', service_name: 'Маникюр' },
];

const mockMasters = [
  { id: 1, name: 'Анна Иванова' },
  { id: 2, name: 'Мария Петрова' },
  { id: 3, name: 'Елена Сидорова' },
];

const mockServices = [
  { id: 1, name: 'Стрижка женская' },
  { id: 2, name: 'Окрашивание' },
  { id: 3, name: 'Маникюр' },
];

const mockUsers = [
  { id: 1, email: 'client@example.com' },
  { id: 2, email: 'maria@example.com' },
];

export function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [masters, setMasters] = useState(mockMasters);
  const [services, setServices] = useState(mockServices);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    date_time: '',
    user_id: '',
    master_id: '',
    service_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, mastersData, servicesData, usersData] = await Promise.all([
        apiClient.getAppointments(),
        apiClient.getMasters(),
        apiClient.getServices(),
        apiClient.getUsers(),
      ]);
      if (appointmentsData?.length) setAppointments(appointmentsData);
      if (mastersData?.length) setMasters(mastersData);
      if (servicesData?.length) setServices(servicesData);
      if (usersData?.length) setUsers(usersData);
    } catch (error) {
      console.log('Using mock data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      user_id: Number(formData.user_id),
      master_id: Number(formData.master_id),
      service_id: Number(formData.service_id),
    };
    try {
      await apiClient.createAppointment(data);
      setShowDialog(false);
      setFormData({ date_time: '', user_id: '', master_id: '', service_id: '' });
      loadData();
    } catch (error) {
      // Mock add
      const master = masters.find(m => m.id === data.master_id);
      const service = services.find(s => s.id === data.service_id);
      const user = users.find(u => u.id === data.user_id);
      const newAppointment = {
        ...data,
        id: Date.now(),
        status: 'scheduled',
        master_name: master?.name || 'Unknown',
        service_name: service?.name || 'Unknown',
        user_email: user?.email || 'Unknown',
      };
      setAppointments([...appointments, newAppointment]);
      setShowDialog(false);
      setFormData({ date_time: '', user_id: '', master_id: '', service_id: '' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.deleteAppointment(id);
      loadData();
    } catch (error) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };

  const getMasterName = (id) => masters.find(m => m.id === id)?.name || 'Unknown';
  const getServiceName = (id) => services.find(s => s.id === id)?.name || 'Unknown';
  const getUserEmail = (id) => users.find(u => u.id === id)?.email || 'Unknown';

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { label: 'Запланировано', variant: 'secondary', icon: Clock },
      confirmed: { label: 'Подтверждено', variant: 'default', icon: CheckCircle },
      completed: { label: 'Завершено', variant: 'outline', icon: CheckCircle },
      canceled: { label: 'Отменено', variant: 'destructive', icon: AlertCircle },
    };
    const config = statusConfig[status] || statusConfig.scheduled;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading && appointments.length === 0) {
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
          <h2 className="text-xl font-semibold text-foreground">Записи</h2>
          <p className="text-sm text-muted-foreground">Управление записями клиентов</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </motion.div>
      </div>

      {/* Appointments List */}
      <StaggerContainer staggerDelay={0.08} className="space-y-4">
        <AnimatePresence>
          {appointments.map((appointment) => (
            <StaggerItem key={appointment.id}>
              <HoverScale scale={1.01}>
                <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-warning/10">
                          <Calendar className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-lg font-semibold text-foreground">
                              {formatDateTime(appointment.date_time)}
                            </span>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{appointment.master_name || getMasterName(appointment.master_id)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{appointment.service_name || getServiceName(appointment.service_id)}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Клиент: {appointment.user_email || getUserEmail(appointment.user_id)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(appointment.id)}
                        className="self-end rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 sm:self-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerContainer>

      {appointments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">Нет записей</h3>
          <p className="text-sm text-muted-foreground">Добавьте первую запись</p>
        </motion.div>
      )}

      {/* Add Appointment Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Новая запись</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appt-datetime">Дата и время</Label>
              <Input
                id="appt-datetime"
                type="datetime-local"
                value={formData.date_time}
                onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Клиент</Label>
              <Select value={formData.user_id} onValueChange={(v) => setFormData({ ...formData, user_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Мастер</Label>
                <Select value={formData.master_id} onValueChange={(v) => setFormData({ ...formData, master_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {masters.map((master) => (
                      <SelectItem key={master.id} value={String(master.id)}>
                        {master.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Услуга</Label>
                <Select value={formData.service_id} onValueChange={(v) => setFormData({ ...formData, service_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={String(service.id)}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
              <Button type="submit">Создать</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
