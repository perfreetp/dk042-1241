import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Building2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderAppointments() {
  const { getProviderAppointments, updateAppointmentStatus } = useAppStore();
  const appointments = getProviderAppointments();
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const statusConfig = {
    pending: { label: '待确认', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
    confirmed: { label: '已确认', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    completed: { label: '已完成', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
    cancelled: { label: '已取消', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  };

  const typeLabels = {
    demo: '产品演示',
    consultation: '顾问咨询',
  };

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, 'confirmed');
  };

  const handleComplete = (id: string) => {
    updateAppointmentStatus(id, 'completed');
  };

  const handleCancel = (id: string) => {
    if (confirm('确定要取消这个预约吗？')) {
      updateAppointmentStatus(id, 'cancelled');
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">预约管理</h1>
          <p className="text-slate-500 mt-1">
            共 {appointments.length} 条预约，其中待确认 {appointments.filter((a) => a.status === 'pending').length} 条
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待确认' },
            { key: 'confirmed', label: '已确认' },
            { key: 'completed', label: '已完成' },
            { key: 'cancelled', label: '已取消' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                filter === tab.key
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointment List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-emerald-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">
                            {apt.productName || typeLabels[apt.type]}
                          </h3>
                          <span
                            className={cn(
                              "px-2.5 py-0.5 text-xs font-medium rounded-full",
                              statusConfig[apt.status].color
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full inline-block mr-1.5 align-middle",
                                statusConfig[apt.status].dot
                              )}
                            />
                            {statusConfig[apt.status].label}
                          </span>
                          <span className="px-2.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                            {typeLabels[apt.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {apt.userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {apt.notes?.includes('手机') ? '已留手机号' : '查看详情'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {apt.time || '待定'}
                      </div>
                      {apt.consultantName && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {apt.consultantName}
                        </div>
                      )}
                    </div>

                    {apt.notes && (
                      <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg">
                        备注：{apt.notes}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirm(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                            确认预约
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            拒绝预约
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleComplete(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                            标记完成
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            取消预约
                          </button>
                        </>
                      )}
                      {apt.status === 'completed' && (
                        <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          已完成
                        </span>
                      )}
                      {apt.status === 'cancelled' && (
                        <span className="px-4 py-2 text-sm font-medium text-slate-500 bg-slate-100 rounded-lg flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          已取消
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无预约</h3>
            <p className="text-slate-500">当前筛选条件下没有预约记录</p>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
}
