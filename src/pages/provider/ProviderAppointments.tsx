import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Building2,
  Edit3,
  Save,
  X,
  MessageSquarePlus,
  History,
  ClipboardList,
  StickyNote,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { AppointmentStatus, Appointment } from '@/types';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderAppointments() {
  const {
    getProviderAppointments,
    updateAppointmentStatus,
    updateAppointmentDetail,
    addAppointmentFollowup,
  } = useAppStore();
  const appointments = getProviderAppointments();
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: '', time: '', userPhone: '', userCompany: '', notes: '' });
  const [followupId, setFollowupId] = useState<string | null>(null);
  const [followupText, setFollowupText] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  const filteredAppointments = useMemo(() => {
    return filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

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

  const handleConfirm = (id: string) => updateAppointmentStatus(id, 'confirmed');
  const handleComplete = (id: string) => updateAppointmentStatus(id, 'completed');
  const handleCancel = (id: string) => {
    if (confirm('确定要取消这个预约吗？')) updateAppointmentStatus(id, 'cancelled');
  };

  const startEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setEditForm({
      date: apt.date || '',
      time: apt.time || '',
      userPhone: apt.userPhone || '',
      userCompany: apt.userCompany || '',
      notes: apt.notes || '',
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateAppointmentDetail(editingId, editForm);
    setEditingId(null);
  };

  const submitFollowup = () => {
    if (!followupId || !followupText.trim()) return;
    addAppointmentFollowup(followupId, followupText.trim());
    setFollowupId(null);
    setFollowupText('');
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">
                            {apt.productName || typeLabels[apt.type]}
                          </h3>
                          <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full", statusConfig[apt.status].color)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full inline-block mr-1.5 align-middle", statusConfig[apt.status].dot)} />
                            {statusConfig[apt.status].label}
                          </span>
                          <span className="px-2.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">{typeLabels[apt.type]}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-3 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">联系人：</span>
                            <span className="text-slate-800">{apt.userName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">电话：</span>
                            <span className="text-slate-800">{apt.userPhone || '未填写'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">公司：</span>
                            <span className="text-slate-800 truncate">{apt.userCompany || '未填写'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-800">{apt.date} {apt.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start gap-1.5">
                          <StickyNote className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-amber-600 font-medium mb-0.5">预约备注</div>
                            <div className="text-sm text-slate-700">{apt.notes}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 跟进时间线（展开） */}
                    {detailId === apt.id && apt.followups && apt.followups.length > 0 && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <History className="w-4 h-4 text-slate-500" />
                          <div className="text-sm font-semibold text-slate-800">跟进进度</div>
                        </div>
                        <div className="relative pl-6 space-y-3">
                          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                          {apt.followups.map((f) => (
                            <div key={f.id} className="relative">
                              <div className={cn(
                                "absolute -left-6 w-3 h-3 rounded-full border-2 mt-1",
                                f.operatorRole === 'provider' ? "bg-white border-emerald-500" : "bg-white border-blue-500"
                              )} />
                              <div className="bg-white rounded-lg border border-slate-200 p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn(
                                      "text-xs px-2 py-0.5 rounded-full font-medium",
                                      f.operatorRole === 'provider'
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-blue-50 text-blue-600"
                                    )}>{f.operatorName}</span>
                                  </div>
                                  <div className="text-xs text-slate-400">{f.createdAt}</div>
                                </div>
                                <div className="text-sm text-slate-700">{f.content}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 编辑表单 */}
                    {editingId === apt.id && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                            <Edit3 className="w-4 h-4" />编辑预约信息
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">预约日期</label>
                            <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">预约时间</label>
                            <input type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">联系人电话</label>
                            <input type="text" value={editForm.userPhone} onChange={(e) => setEditForm({ ...editForm, userPhone: e.target.value })}
                              placeholder="如 138****8888"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">公司/门店</label>
                            <input type="text" value={editForm.userCompany} onChange={(e) => setEditForm({ ...editForm, userCompany: e.target.value })}
                              placeholder="填写公司或门店名"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">预约备注</label>
                          <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                            rows={2} placeholder="补充用户需求、注意事项等"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 resize-none" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
                            <X className="w-4 h-4" />取消
                          </button>
                          <button onClick={saveEdit}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                            <Save className="w-4 h-4" />保存
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 新增跟进备注 */}
                    {followupId === apt.id && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-purple-800">
                          <MessageSquarePlus className="w-4 h-4" />添加跟进备注
                        </div>
                        <textarea value={followupText} onChange={(e) => setFollowupText(e.target.value)}
                          rows={2} placeholder="记录与客户的沟通进展、下一步计划等"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-500 resize-none" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setFollowupId(null); setFollowupText(''); }}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                            取消
                          </button>
                          <button onClick={submitFollowup} disabled={!followupText.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
                            <Save className="w-4 h-4" />提交
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => handleConfirm(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />确认预约
                          </button>
                          <button onClick={() => handleCancel(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />拒绝
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <button onClick={() => handleComplete(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />标记完成
                          </button>
                          <button onClick={() => handleCancel(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            取消预约
                          </button>
                        </>
                      )}

                      <button onClick={() => startEdit(apt)}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4" />编辑信息
                      </button>
                      <button onClick={() => setFollowupId(followupId === apt.id ? null : apt.id)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium rounded-lg border flex items-center gap-1.5",
                          followupId === apt.id
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                        )}>
                        <MessageSquarePlus className="w-4 h-4" />跟进备注
                      </button>
                      <button onClick={() => setDetailId(detailId === apt.id ? null : apt.id)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium rounded-lg border flex items-center gap-1.5",
                          detailId === apt.id
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                        )}>
                        <ClipboardList className="w-4 h-4" />
                        进度 {apt.followups?.length || 0}
                      </button>
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
