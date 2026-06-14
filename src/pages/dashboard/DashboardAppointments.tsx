import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  MoreVertical,
  Building2,
  Phone,
  User,
  History,
  ChevronDown,
  ChevronUp,
  StickyNote,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardAppointments() {
  const { appointments, updateAppointmentStatus } = useAppStore();
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(
    appointments.length > 0 ? appointments[0].id : null
  );

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const statusConfig = {
    pending: { label: '待确认', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', bar: 'border-amber-400' },
    confirmed: { label: '已确认', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500', bar: 'border-blue-400' },
    completed: { label: '已完成', color: 'bg-green-50 text-green-600', dot: 'bg-green-500', bar: 'border-green-400' },
    cancelled: { label: '已取消', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400', bar: 'border-slate-300' },
  };

  const statusOrder: AppointmentStatus[] = ['pending', 'confirmed', 'completed'];

  const typeLabels = {
    demo: '产品演示',
    consultation: '顾问咨询',
  };

  const handleCancel = (id: string) => {
    if (confirm('确定要取消这个预约吗？')) {
      updateAppointmentStatus(id, 'cancelled');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">预约管理</h1>
          <p className="text-slate-500 mt-1">
            管理你的产品演示和顾问咨询预约，查看完整跟进进度
          </p>
        </div>

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
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border-l-4",
                      statusConfig[apt.status].bar,
                      "bg-blue-50 border-l-0"
                    )} style={{ borderLeftWidth: 4 }}>
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900">
                              {apt.productName || typeLabels[apt.type]}
                            </h3>
                            <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full", statusConfig[apt.status].color)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full inline-block mr-1.5 align-middle", statusConfig[apt.status].dot)} />
                              {statusConfig[apt.status].label}
                            </span>
                            <span className="px-2.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                              {typeLabels[apt.type]}
                            </span>
                            {apt.providerName && (
                              <span className="px-2.5 py-0.5 text-xs bg-indigo-50 text-indigo-600 rounded-full">
                                {apt.providerName}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-3 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-800">{apt.userName}</span>
                            </div>
                            {apt.userPhone && (
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-800">{apt.userPhone}</span>
                              </div>
                            )}
                            {apt.userCompany && (
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-800 truncate">{apt.userCompany}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-800">{apt.date} {apt.time}</span>
                            </div>
                          </div>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-start gap-1.5">
                            <StickyNote className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-slate-500 font-medium mb-0.5">预约备注</div>
                              <div className="text-sm text-slate-700">{apt.notes}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 状态进度条 */}
                      {apt.status !== 'cancelled' && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <History className="w-4 h-4 text-slate-500" />
                              <div className="text-xs font-semibold text-slate-700">预约进度</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {statusOrder.map((s, idx) => {
                              const isActive = s === apt.status;
                              const isPast = statusOrder.indexOf(apt.status) > idx;
                              const isDone = apt.status === 'completed';
                              return (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center">
                                    <div className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                                      isPast || isDone
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : isActive
                                          ? `bg-white border-2 ${statusConfig[s].bar} ${statusConfig[s].color.replace('text-', 'text-').replace('-50 ', '-600 ')} animate-pulse`
                                          : "bg-white border-slate-200 text-slate-400"
                                    )}>
                                      {(isPast || isDone) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    <div className={cn(
                                      "text-xs mt-1.5 whitespace-nowrap",
                                      isPast || isDone ? "text-emerald-600 font-medium" : isActive ? "text-slate-800 font-medium" : "text-slate-400"
                                    )}>
                                      {statusConfig[s].label}
                                    </div>
                                  </div>
                                  {idx < statusOrder.length - 1 && (
                                    <div className={cn(
                                      "flex-1 h-0.5 mx-2 mb-5",
                                      (isPast || (isActive && idx === 0)) ? "bg-emerald-400" : "bg-slate-200"
                                    )} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                            >
                              {expandedId === apt.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              查看进度
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              取消预约
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-4 h-4" />
                              查看沟通进度
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
                          <>
                            <button
                              onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                            >
                              {expandedId === apt.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              查看完整记录
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4" />
                              评价服务
                            </button>
                          </>
                        )}
                        {apt.status === 'cancelled' && (
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            重新预约
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 展开的跟进时间线 */}
                {expandedId === apt.id && apt.followups && apt.followups.length > 0 && (
                  <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white px-5 py-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <History className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">完整跟进时间线</div>
                        <div className="text-xs text-slate-500">所有操作记录都在这里，随时可以回溯</div>
                      </div>
                    </div>
                    <div className="relative pl-7 space-y-3">
                      <div className="absolute left-3.5 top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-emerald-300 rounded-full" />
                      {apt.followups.map((f, i) => (
                        <div key={f.id} className="relative">
                          <div className={cn(
                            "absolute -left-7 w-7 h-7 rounded-full flex items-center justify-center border-2",
                            f.action === 'created' ? "bg-blue-50 border-blue-500"
                              : f.action === 'confirmed' ? "bg-blue-50 border-indigo-500"
                              : f.action === 'completed' ? "bg-emerald-50 border-emerald-500"
                              : f.action === 'cancelled' ? "bg-slate-50 border-slate-400"
                              : "bg-white border-purple-400 shadow-sm"
                          )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              f.action === 'created' ? "bg-blue-500"
                                : f.action === 'confirmed' ? "bg-indigo-500"
                                : f.action === 'completed' ? "bg-emerald-500"
                                : f.action === 'cancelled' ? "bg-slate-400"
                                : "bg-purple-500"
                            )} />
                          </div>
                          <div className={cn(
                            "rounded-xl border p-4 transition-all hover:shadow-sm",
                            i === apt.followups!.length - 1
                              ? "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50"
                              : "bg-white/70 border-slate-100"
                          )}>
                            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full font-semibold",
                                  f.operatorRole === 'provider'
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : f.operatorRole === 'consultant'
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                      : "bg-blue-50 text-blue-700 border border-blue-100"
                                )}>
                                  {f.operatorName}
                                </span>
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  f.action === 'created' ? "bg-blue-100 text-blue-700"
                                    : f.action === 'confirmed' ? "bg-indigo-100 text-indigo-700"
                                    : f.action === 'completed' ? "bg-emerald-100 text-emerald-700"
                                    : f.action === 'cancelled' ? "bg-slate-100 text-slate-600"
                                    : "bg-purple-100 text-purple-700"
                                )}>
                                  {f.action === 'created' ? '提交预约'
                                    : f.action === 'confirmed' ? '确认'
                                    : f.action === 'completed' ? '完成'
                                    : f.action === 'cancelled' ? '取消'
                                    : f.action === 'reschedule' ? '改期'
                                    : '跟进备注'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 font-mono">{f.createdAt}</div>
                            </div>
                            <div className="text-sm text-slate-700 leading-relaxed">{f.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无预约</h3>
            <p className="text-slate-500">去产品库看看，预约感兴趣的产品演示吧</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
