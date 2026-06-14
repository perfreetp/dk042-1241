import { useState } from 'react';
import { MessageCircle, Send, Clock, CheckCircle, User, Filter } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderInquiries() {
  const { providerInquiries, addProviderInquiryReply } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(providerInquiries[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | 'completed'>('all');
  const [replyText, setReplyText] = useState('');

  const selectedInquiry = providerInquiries.find((i) => i.id === selectedId);

  const filteredInquiries = providerInquiries.filter((i) => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const statusConfig = {
    pending: { label: '待回复', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
    replied: { label: '已回复', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    completed: { label: '已完成', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  };

  const handleSend = () => {
    if (!replyText.trim() || !selectedId) return;
    addProviderInquiryReply(selectedId, replyText.trim());
    setReplyText('');
  };

  return (
    <ProviderLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">咨询管理</h1>
            <p className="text-slate-500 mt-1">管理客户咨询，及时回复跟进</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">全部咨询</option>
              <option value="pending">待回复</option>
              <option value="replied">已回复</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">
                咨询列表 ({filteredInquiries.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredInquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => setSelectedId(inquiry.id)}
                  className={cn(
                    "w-full p-4 text-left border-b border-slate-50 transition-colors",
                    selectedId === inquiry.id
                      ? "bg-emerald-50 border-l-2 border-l-emerald-500"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-slate-900 text-sm truncate">
                      {inquiry.userName}
                    </div>
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
                        statusConfig[inquiry.status as keyof typeof statusConfig].dot
                      )}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    {inquiry.product}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {inquiry.message}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">{inquiry.time}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {selectedInquiry ? (
              <>
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {selectedInquiry.userName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedInquiry.company} · {selectedInquiry.product}
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full",
                        statusConfig[selectedInquiry.status as keyof typeof statusConfig].color
                      )}
                    >
                      {statusConfig[selectedInquiry.status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedInquiry.replies.map((reply, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        reply.role === 'me' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3",
                          reply.role === 'me'
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-slate-100 text-slate-700 rounded-bl-md"
                        )}
                      >
                        <p className="text-sm">{reply.content}</p>
                        <div
                          className={cn(
                            "text-xs mt-1.5 opacity-60",
                            reply.role === 'me' ? "text-right" : "text-left"
                          )}
                        >
                          {reply.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedInquiry.status !== 'completed' && (
                  <div className="p-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="输入回复内容..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                      />
                      <button
                        onClick={handleSend}
                        className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                请选择一条咨询查看详情
              </div>
            )}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
