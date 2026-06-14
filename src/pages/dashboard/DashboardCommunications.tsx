import { useState } from 'react';
import { MessageSquare, Phone, Mail, FileText, Send, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardCommunications() {
  const { communications, appointments, addCommunication } = useAppStore();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    appointments[0]?.id || null
  );
  const [newMessage, setNewMessage] = useState('');

  const selectedAppointment = appointments.find((a) => a.id === selectedAppointmentId);
  const appointmentComms = communications.filter(
    (c) => c.appointmentId === selectedAppointmentId
  );

  const typeIcons = {
    note: <FileText className="w-4 h-4" />,
    call: <Phone className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    meeting: <MessageSquare className="w-4 h-4" />,
  };

  const typeLabels = {
    note: '备注',
    call: '电话',
    email: '邮件',
    meeting: '会议',
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedAppointmentId) return;
    addCommunication({
      appointmentId: selectedAppointmentId,
      userId: 'user1',
      consultantId: selectedAppointment?.consultantId || 'c1',
      content: newMessage,
      type: 'note',
    });
    setNewMessage('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">沟通记录</h1>
          <p className="text-slate-500 mt-1">查看和管理你的顾问沟通记录</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Appointment List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">预约列表</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {appointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => setSelectedAppointmentId(apt.id)}
                  className={cn(
                    "w-full p-4 text-left border-b border-slate-50 transition-colors",
                    selectedAppointmentId === apt.id
                      ? "bg-blue-50 border-l-2 border-l-blue-500"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="font-medium text-slate-900 text-sm truncate">
                    {apt.productName || '顾问咨询'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {apt.date} {apt.time}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {apt.consultantName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {selectedAppointment ? (
              <>
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {selectedAppointment.consultantName}
                      </div>
                      <div className="text-xs text-green-500">在线</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {appointmentComms.length > 0 ? (
                    appointmentComms.map((comm) => (
                      <div
                        key={comm.id}
                        className={cn(
                          "flex",
                          comm.userId === 'user1' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-3",
                            comm.userId === 'user1'
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-slate-100 text-slate-700 rounded-bl-md"
                          )}
                        >
                          <div className="flex items-center gap-1.5 mb-1 opacity-70 text-xs">
                            {typeIcons[comm.type]}
                            <span>{typeLabels[comm.type]}</span>
                          </div>
                          <p className="text-sm">{comm.content}</p>
                          <div
                            className={cn(
                              "text-xs mt-1.5 opacity-60",
                              comm.userId === 'user1' ? "text-right" : "text-left"
                            )}
                          >
                            {comm.createdAt}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      暂无沟通记录
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="输入消息..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                    <button
                      onClick={handleSend}
                      className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                请选择一个预约查看沟通记录
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
