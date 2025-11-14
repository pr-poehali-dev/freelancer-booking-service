import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  phone: string;
  notes?: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      clientName: 'Анна Петрова',
      service: 'Стрижка',
      time: '10:00',
      duration: 60,
      phone: '+7 999 123-45-67',
    },
    {
      id: '2',
      clientName: 'Мария Иванова',
      service: 'Окрашивание',
      time: '14:00',
      duration: 120,
      phone: '+7 999 234-56-78',
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    service: '',
    time: '',
    duration: 60,
    phone: '',
    notes: '',
  });

  const weekStart = startOfWeek(selectedDate, { locale: ru, weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const services = [
    { name: 'Стрижка', duration: 60, price: 1500 },
    { name: 'Окрашивание', duration: 120, price: 3500 },
    { name: 'Укладка', duration: 45, price: 1200 },
    { name: 'Маникюр', duration: 90, price: 2000 },
  ];

  const handleCreateAppointment = () => {
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
    };
    setAppointments([...appointments, appointment]);
    setIsNewAppointmentOpen(false);
    setNewAppointment({
      clientName: '',
      service: '',
      time: '',
      duration: 60,
      phone: '',
      notes: '',
    });
  };

  const menuItems = [
    { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
    { id: 'appointments', label: 'Записи', icon: 'ClipboardList' },
    { id: 'clients', label: 'Клиенты', icon: 'Users' },
    { id: 'services', label: 'Услуги', icon: 'Scissors' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-foreground">BookMaster</h1>
          <p className="text-sm text-muted-foreground mt-1">Личный кабинет</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Елена Смирнова</p>
              <p className="text-xs text-muted-foreground truncate">Мастер маникюра</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
              </p>
            </div>

            <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm">
                  <Icon name="Plus" size={18} />
                  Новая запись
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Создать запись</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Имя клиента</Label>
                    <Input
                      id="clientName"
                      placeholder="Введите имя"
                      value={newAppointment.clientName}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, clientName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      placeholder="+7 999 123-45-67"
                      value={newAppointment.phone}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Услуга</Label>
                    <Select
                      value={newAppointment.service}
                      onValueChange={(value) => {
                        const service = services.find((s) => s.name === value);
                        setNewAppointment({
                          ...newAppointment,
                          service: value,
                          duration: service?.duration || 60,
                        });
                      }}
                    >
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name} ({service.duration} мин, {service.price} ₽)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Время</Label>
                    <Select
                      value={newAppointment.time}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, time: value })
                      }
                    >
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Примечания</Label>
                    <Textarea
                      id="notes"
                      placeholder="Дополнительная информация"
                      value={newAppointment.notes}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsNewAppointmentOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateAppointment}
                    disabled={
                      !newAppointment.clientName ||
                      !newAppointment.phone ||
                      !newAppointment.service ||
                      !newAppointment.time
                    }
                  >
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-8">
          {activeSection === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Календарь записей</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                      >
                        <Icon name="ChevronLeft" size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                        Сегодня
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                      >
                        <Icon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-8 border-b bg-muted/30">
                      <div className="p-3 text-sm font-medium text-muted-foreground border-r">
                        Время
                      </div>
                      {weekDays.map((day, idx) => (
                        <div
                          key={idx}
                          className={`p-3 text-center border-r last:border-r-0 ${
                            format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                              ? 'bg-primary/5'
                              : ''
                          }`}
                        >
                          <div className="text-xs text-muted-foreground">
                            {format(day, 'EEE', { locale: ru })}
                          </div>
                          <div className="text-sm font-medium mt-1">{format(day, 'd MMM')}</div>
                        </div>
                      ))}
                    </div>

                    {timeSlots.map((slot) => (
                      <div key={slot} className="grid grid-cols-8 border-b last:border-b-0">
                        <div className="p-3 text-sm text-muted-foreground border-r bg-muted/10">
                          {slot}
                        </div>
                        {weekDays.map((day, idx) => {
                          const appointment = appointments.find((app) => app.time === slot);
                          return (
                            <div
                              key={idx}
                              className="p-2 border-r last:border-r-0 min-h-[80px] hover:bg-muted/30 transition-colors cursor-pointer"
                            >
                              {appointment && idx === 0 && (
                                <div className="bg-primary/10 border border-primary/20 rounded-md p-2 text-xs">
                                  <div className="font-medium text-primary">
                                    {appointment.clientName}
                                  </div>
                                  <div className="text-muted-foreground mt-1">
                                    {appointment.service}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                    <Icon name="Clock" size={12} />
                                    {appointment.duration} мин
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="Calendar" size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{appointments.length}</p>
                        <p className="text-sm text-muted-foreground">Записей сегодня</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Icon name="CheckCircle" size={24} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">8</p>
                        <p className="text-sm text-muted-foreground">Свободных слотов</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Icon name="TrendingUp" size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">5000 ₽</p>
                        <p className="text-sm text-muted-foreground">Выручка за день</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'appointments' && (
            <div className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Все записи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="User" size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.clientName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-medium">{appointment.service}</p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.time} · {appointment.duration} мин
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Icon name="MoreVertical" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'clients' && (
            <div className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>База клиентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Раздел в разработке</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'services' && (
            <div className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Список услуг</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.duration} минут</p>
                        </div>
                        <p className="text-lg font-semibold">{service.price} ₽</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки профиля</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Раздел в разработке</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
